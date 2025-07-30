import { PrismaClient, Prisma } from '@prisma/client';
import { Challenge, ChallengeStatus, ChallengeTime } from '../models/challenges.js';
import { Coordinates, Place, PlaceStatus } from '../models/places.js';
import { Expertise, Player } from '../models/players.js';
import { GenericOperationError, NotFoundError, DeleteOperationError } from '../utils/exceptions.js';
import { BaseCRUDService, BaseSearchService, ChallengeRepository, PaginatedResult } from './repository-interfaces.js';
import { logger } from '../utils/logger.js';
import { ChallengeDataSchema } from '../schemas/challenge-schema.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { PaginationOptions } from '../models/common.js';
import { buildObjectId } from '../utils/common.js';
import { exceptionMapping } from '../utils/exception-mapping-decorator.js';

type ChallengeWithRelations = Prisma.ChallengeGetPayload<{
  include: {
    place: true;
    owner: true;
    players: { include: { player: true } };
  };
}>;

export const mapToChallenge = (prismaChallenge: ChallengeWithRelations): Challenge => {
  return {
    id: prismaChallenge.id,
    name: prismaChallenge.name,
    place: {
      id: prismaChallenge.place.id,
      name: prismaChallenge.place.name,
      coordinates: { lat: prismaChallenge.place.lat, long: prismaChallenge.place.long },
      status: prismaChallenge.place.status as PlaceStatus,
    },
    status: prismaChallenge.status as ChallengeStatus,
    date: prismaChallenge.date,
    time: prismaChallenge.time as ChallengeTime,
    owner: {
      id: prismaChallenge.owner.id,
      name: prismaChallenge.owner.name,
      expertise: prismaChallenge.owner.expertise as Expertise,
      points: prismaChallenge.owner.points,
    },
    players: prismaChallenge.players.map((p) => ({
      id: p.player.id,
      name: p.player.name,
      expertise: p.player.expertise as Expertise,
      points: p.player.points,
    })),
  };
};
interface FindManyResult<T> {
  cusrorId?: string;
  results: T[];
}

abstract class BasePrismaSearchRepository<T> implements BaseSearchService<T> {
  constructor(protected readonly prismaClient: PrismaClient = new PrismaClient()) {}

  async search(
    query: Record<string, any>,
    pagination: PaginationOptions,
    order: string = 'asc',
  ): Promise<PaginatedResult<T>> {
    const take = Math.min(pagination.pageSize, pagination.maxResult);
    if (take === 0) {
      return {
        results: [],
        nextToken: undefined,
      };
    }

    const sortOrder = order === 'desc' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;
    const findManyResult = await this.findMany(query, take, sortOrder, pagination.nextToken);
    return {
      results: findManyResult.results,
      nextToken: findManyResult.cusrorId,
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected async findMany(
    query: Record<string, any>,
    take: number,
    order: Prisma.SortOrder,
    cursorId?: string,
  ): Promise<FindManyResult<T>> {
    throw new Error('Not implemented');
  }
}

/**
 * Challenges
 */

export class PrismaChallengeSearchRepository extends BasePrismaSearchRepository<Challenge> {
  protected async findMany(
    query: Record<string, any>,
    take: number,
    order: Prisma.SortOrder,
    cursorId?: string,
  ): Promise<FindManyResult<Challenge>> {
    const challenges = await this.prismaClient.challenge.findMany({
      take: take,
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      where: query,
      orderBy: { id: order },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });
    logger.info(`Challenges fetched: ${challenges.length}`, { count: challenges.length });

    const lastPostInResults = challenges[take - 1]; // Remember: zero-based index! :)
    return {
      results: challenges.map(mapToChallenge),
      cusrorId: lastPostInResults ? lastPostInResults.id : undefined,
    };
  }
}

export class PrismaChallengeCRUDRepository implements BaseCRUDService<Challenge, ChallengeDataSchema, string> {
  private readonly searchRepository: PrismaChallengeSearchRepository;

  constructor(private readonly prismaClient: PrismaClient = new PrismaClient()) {
    this.searchRepository = new PrismaChallengeSearchRepository(prismaClient);
  }

  async getAll(pagination: PaginationOptions): Promise<PaginatedResult<Challenge>> {
    const challenges = await this.searchRepository.search({}, pagination);
    return {
      results: challenges.results,
      nextToken: challenges.nextToken,
    };
  }

  async getById(id: string): Promise<Challenge | undefined> {
    const challenge = await this.prismaClient.challenge.findUnique({
      where: { id },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });

    return challenge ? mapToChallenge(challenge) : undefined;
  }

  async create(data: ChallengeDataSchema): Promise<Challenge> {
    const challengeId = buildObjectId('ch');

    logger.info('Creating challenge', { challengeId, placeId: data.placeId, ownerId: data.ownerId });

    try {
      const challenge = await this.prismaClient.challenge.create({
        data: {
          id: challengeId,
          name: data.name,
          time: data.time,
          status: data.status,
          date: data.date,
          place_id: data.placeId,
          player_owner_id: data.ownerId,
          createdAt: new Date(),
          lastUpdate: new Date(),
          players: data.playersId
            ? {
                create: data.playersId.map((playerId) => ({
                  player_id: playerId,
                })),
              }
            : undefined,
        },
        include: {
          place: true,
          owner: true,
          players: { include: { player: true } },
        },
      });

      logger.info('Challenge created successfully', { challengeId });
      return mapToChallenge(challenge);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          // Foreign key constraint failed
          throw new NotFoundError('Place or Player', data.placeId + '/' + data.ownerId);
        }
      }
      throw error;
    }
  }

  async update(id: string, data: ChallengeDataSchema): Promise<Challenge> {
    const challenge = await this.prismaClient.challenge.update({
      where: { id },
      data: {
        name: data.name,
        time: data.time,
        status: data.status,
        date: data.date,
        place_id: data.placeId,
        player_owner_id: data.ownerId,
        lastUpdate: new Date(),
        players: data.playersId
          ? {
              create: data.playersId.map((playerId) => ({
                player_id: playerId,
              })),
            }
          : undefined,
      },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });

    return mapToChallenge(challenge);
  }

  @exceptionMapping([
    [Prisma.PrismaClientKnownRequestError, DeleteOperationError, 'Cannot delete resource'],
    [Error, GenericOperationError, 'Unknown error while deleting resource'],
  ])
  async delete(id: string): Promise<void> {
    await this.prismaClient.challenge.delete({
      where: { id },
    });
  }
}

/**
 * Places
 */

export class PrismaPlaceSearchRepository extends BasePrismaSearchRepository<Place> {
  protected async findMany(
    query: Record<string, any>,
    take: number,
    order: Prisma.SortOrder,
    cursorId?: string,
  ): Promise<FindManyResult<Place>> {
    const places = await this.prismaClient.place.findMany({
      take: take,
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      where: query,
      orderBy: { id: order },
    });

    const lastPostInResults = places[take - 1];
    return {
      results: places.map((place) => ({
        id: place.id,
        name: place.name,
        coordinates: { lat: place.lat, long: place.long },
        status: place.status as PlaceStatus,
      })),
      cusrorId: lastPostInResults ? lastPostInResults.id : undefined,
    };
  }
}

export class PrismaPlaceCRUDRepository implements BaseCRUDService<Place, PlaceDataObject, string> {
  private readonly searchRepository: PrismaPlaceSearchRepository;

  constructor(private readonly prismaClient: PrismaClient = new PrismaClient()) {
    this.searchRepository = new PrismaPlaceSearchRepository(prismaClient);
  }

  async getAll(pagination: PaginationOptions): Promise<PaginatedResult<Place>> {
    return await this.searchRepository.search({}, pagination);
  }

  async getById(id: string): Promise<Place | undefined> {
    const place = await this.prismaClient.place.findUnique({
      where: { id },
    });

    return place
      ? {
          id: place.id,
          name: place.name,
          coordinates: { lat: place.lat, long: place.long },
          status: place.status as PlaceStatus,
        }
      : undefined;
  }

  async create(data: PlaceDataObject): Promise<Place> {
    const placeId = `place_${Date.now()}`;

    const place = await this.prismaClient.place.create({
      data: {
        id: placeId,
        name: data.name,
        lat: data.coordinates.lat,
        long: data.coordinates.long,
        status: PlaceStatus.UNVERIFIED,
      },
    });

    return {
      id: place.id,
      name: place.name,
      coordinates: { lat: place.lat, long: place.long },
      status: place.status as PlaceStatus,
    };
  }

  async update(id: string, data: PlaceDataObject): Promise<Place> {
    const place = await this.prismaClient.place.update({
      where: { id },
      data: {
        name: data.name,
        lat: data.coordinates.lat,
        long: data.coordinates.long,
      },
    });

    return {
      id: place.id,
      name: place.name,
      coordinates: { lat: place.lat, long: place.long },
      status: place.status as PlaceStatus,
    };
  }

  async delete(id: string): Promise<void> {
    const resp = await this.prismaClient.place.delete({
      where: { id },
    });
    logger.info(`Deleted place id: ${resp.id}`);
  }
}

/**
 * Players
 */

export class PrismaPlayerSearchRepository extends BasePrismaSearchRepository<Player> {
  protected async findMany(
    query: Record<string, any>,
    take: number,
    order: Prisma.SortOrder,
    cursorId?: string,
  ): Promise<FindManyResult<Player>> {
    const players = await this.prismaClient.player.findMany({
      take: take,
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      where: query,
      orderBy: { id: order },
    });

    const lastPostInResults = players[take - 1];
    return {
      results: players.map((player) => ({
        id: player.id,
        name: player.name,
        expertise: player.expertise as Expertise,
        points: player.points,
      })),
      cusrorId: lastPostInResults ? lastPostInResults.id : undefined,
    };
  }
}

export class PrismaPlayerCRUDRepository implements BaseCRUDService<Player, PlayerDataObject, string> {
  private readonly searchRepository: PrismaPlayerSearchRepository;

  constructor(private readonly prismaClient: PrismaClient = new PrismaClient()) {
    this.searchRepository = new PrismaPlayerSearchRepository(prismaClient);
  }

  async getAll(pagination: PaginationOptions): Promise<PaginatedResult<Player>> {
    return await this.searchRepository.search({}, pagination);
  }

  async getById(id: string): Promise<Player | undefined> {
    const player = await this.prismaClient.player.findUnique({
      where: { id },
    });

    return player
      ? {
          id: player.id,
          name: player.name,
          expertise: player.expertise as Expertise,
          points: player.points,
        }
      : undefined;
  }

  async create(data: PlayerDataObject): Promise<Player> {
    const playerId = `player_${Date.now()}`;

    const player = await this.prismaClient.player.create({
      data: {
        id: playerId,
        name: data.name,
        expertise: data.expertise,
        points: data.points || 0,
      },
    });

    return {
      id: player.id,
      name: player.name,
      expertise: player.expertise as Expertise,
      points: player.points,
    };
  }

  async update(id: string, data: PlayerDataObject): Promise<Player> {
    const player = await this.prismaClient.player.update({
      where: { id },
      data: {
        name: data.name,
        expertise: data.expertise,
        points: data.points,
      },
    });

    return {
      id: player.id,
      name: player.name,
      expertise: player.expertise as Expertise,
      points: player.points,
    };
  }

  async delete(id: string): Promise<void> {
    const resp = await this.prismaClient.player.delete({
      where: { id },
    });
    logger.info(`Deleted player id: ${resp.id}`);
  }
}

/**
 * DEPRECATED
 */

export class PrismaChallengeRepository implements ChallengeRepository {
  constructor(private readonly prismaClient: PrismaClient = new PrismaClient()) {}

  async createChallenge(
    name: string,
    placeId: string,
    date: Date,
    time: ChallengeTime,
    ownerId: string,
    status: ChallengeStatus = ChallengeStatus.ACTIVE,
    playersId?: string[],
  ): Promise<Challenge> {
    const challengeId = `challenge_${Date.now()}`;
    logger.info('Creating challenge', { challengeId, placeId, ownerId });

    try {
      const challenge = await this.prismaClient.challenge.create({
        data: {
          id: challengeId,
          name: name,
          time: time,
          status: status,
          date: date,
          place_id: placeId,
          player_owner_id: ownerId,
          createdAt: new Date(),
          lastUpdate: new Date(),
          players: playersId
            ? {
                create: playersId.map((playerId) => ({
                  player_id: playerId,
                })),
              }
            : undefined,
        },
        include: {
          place: true,
          owner: true,
          players: { include: { player: true } },
        },
      });

      logger.info('Challenge created successfully', { challengeId });
      return mapToChallenge(challenge);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          // Foreign key constraint failed
          throw new NotFoundError('Place or Player', placeId + '/' + ownerId);
        }
      }
      throw error;
    }
  }

  async getAllChallenges(): Promise<Challenge[]> {
    logger.info('Fetching all challenges');
    const challenges = await this.prismaClient.challenge.findMany({
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });

    logger.info('Challenges fetched', { count: challenges.length });
    return challenges.map(mapToChallenge);
  }

  async createPlace(name: string, coordinates: Coordinates): Promise<Place> {
    const placeId = `place_${Date.now()}`;

    const place = await this.prismaClient.place.create({
      data: {
        id: placeId,
        name,
        lat: coordinates.lat,
        long: coordinates.long,
        status: PlaceStatus.UNVERIFIED,
      },
    });

    return {
      id: place.id,
      name: place.name,
      coordinates: { lat: place.lat, long: place.long },
      status: place.status as PlaceStatus,
    };
  }

  async getAllPlaces(): Promise<Place[]> {
    const places = await this.prismaClient.place.findMany();

    return places.map((place) => ({
      id: place.id,
      name: place.name,
      coordinates: { lat: place.lat, long: place.long },
      status: place.status as PlaceStatus,
    }));
  }

  async createPlayer(name: string, expertise: Expertise, points: number = 0): Promise<Player> {
    const playerId = `player_${Date.now()}`;

    const player = await this.prismaClient.player.create({
      data: {
        id: playerId,
        name,
        expertise,
        points,
      },
    });

    return {
      id: player.id,
      name: player.name,
      expertise,
      points,
    };
  }

  async getAllPlayers(): Promise<Player[]> {
    const players = await this.prismaClient.player.findMany();

    return players.map((player) => ({
      id: player.id,
      name: player.name,
      expertise: player.expertise as Expertise,
      points: player.points,
    }));
  }
}

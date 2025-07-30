import { Challenge } from '../models/challenges.js';
import { Place } from '../models/places.js';
import { Player } from '../models/players.js';
import { ChallengeRepository } from '../repositories/repository-interfaces.js';
import { ChallengeDataSchema } from '../schemas/challenge-schema.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { BaseServiceInterface, ServicePaginationOptions } from './base-service.js';
import { BaseCRUDService, BaseSearchService } from '../repositories/repository-interfaces.js';
import { logger } from '../utils/logger.js';

export class ChallengeService {
  constructor(
    private readonly challengeSvc: ChallengesService,
    private readonly challengeDB: ChallengeRepository,
  ) {}

  async createChallenge(challenge: ChallengeDataSchema): Promise<Challenge> {
    return this.challengeSvc.create(challenge);
  }

  async getChallenges(): Promise<Challenge[]> {
    // return this.challengeDB.getAllChallenges();
    return this.challengeSvc.getAll({ pageSize: 1000, maxResult: 1000 });
  }

  async createPlace(place: PlaceDataObject): Promise<Place> {
    // return this.challengeDB.createPlace(place.name, place.coordinates);
    return this.challengeDB.createPlace(place.name, place.coordinates);
  }

  async getPlaces(): Promise<Place[]> {
    return this.challengeDB.getAllPlaces();
  }

  async createPlayer(player: PlayerDataObject): Promise<Player> {
    return this.challengeDB.createPlayer(player.name, player.expertise, player.points);
  }

  async getPlayers(): Promise<Player[]> {
    return this.challengeDB.getAllPlayers();
  }
}

/**
 * Challenges service
 */

export class ChallengesService implements BaseServiceInterface<Challenge, ChallengeDataSchema> {
  constructor(
    private readonly challengeCRUDRepository: BaseCRUDService<Challenge, ChallengeDataSchema, string>,
    private readonly challengeSearchRepository: BaseSearchService<Challenge>,
  ) {}

  async getAll(pagination: ServicePaginationOptions): Promise<Challenge[]> {
    logger.info(`Getting all challenges ${{ pagination }}`, { pagination });
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0) {
      return [];
    }
    const challenges = new Array<Challenge>();
    const pageSize = pagination.pageSize > maxResult ? maxResult : pagination.pageSize;

    let nextToken = undefined;
    do {
      const getAllResult = await this.challengeCRUDRepository.getAll({
        pageSize: pageSize,
        maxResult: Math.max(maxResult - challenges.length, 0),
        nextToken: nextToken,
      });
      challenges.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return challenges;
  }

  async getById(id: string): Promise<Challenge | undefined> {
    return this.challengeCRUDRepository.getById(id);
  }

  async create(data: ChallengeDataSchema): Promise<Challenge> {
    return this.challengeCRUDRepository.create(data);
  }
  async update(id: string, data: ChallengeDataSchema): Promise<Challenge> {
    return this.challengeCRUDRepository.update(id, data);
  }
  async delete(id: string): Promise<void> {
    return this.challengeCRUDRepository.delete(id);
  }

  async search(query: Record<string, any>, pagination: ServicePaginationOptions): Promise<Challenge[]> {
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0 || pagination.pageSize < 0) {
      return [];
    }
    const challenges = new Array<Challenge>();
    const pageSize = Math.min(pagination.pageSize, maxResult);

    let nextToken = undefined;
    do {
      const getAllResult = await this.challengeSearchRepository.search(query, {
        pageSize: pageSize,
        maxResult: Math.max(maxResult - challenges.length, 0),
        nextToken: nextToken,
      });
      challenges.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return challenges;
  }
}

import { Challenge } from '../models/challenges.js';
import { Place } from '../models/places.js';
import { Player } from '../models/players.js';
import { ChallengeDataObject } from '../schemas/challenge-schema.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { FoosballServiceFacade } from './foosball-service.js';
import { BaseServiceInterface } from './base-service.js';
import { PrismaClient } from '@prisma/client/extension';
import {
  PrismaChallengeCRUDRepository,
  PrismaChallengeSearchRepository,
  PrismaPlaceCRUDRepository,
  PrismaPlaceSearchRepository,
  PrismaPlayerCRUDRepository,
  PrismaPlayerSearchRepository,
} from '../repositories/prisma-repository.js';
import { ChallengesService } from './challenge-service.js';
import { PlacesService } from './place-service.js';
import { PlayersService } from './player-service.js';

export class SQLFoosballService implements FoosballServiceFacade {
  private readonly challengesSvc: BaseServiceInterface<Challenge, ChallengeDataObject>;
  private readonly placesSvc: BaseServiceInterface<Place, PlaceDataObject>;
  private readonly playersSvc: BaseServiceInterface<Player, PlayerDataObject>;

  constructor(
    private readonly prismaClient: PrismaClient = new PrismaClient(),
    private readonly pageSize: number = 1000,
  ) {
    this.challengesSvc = new ChallengesService(
      new PrismaChallengeCRUDRepository(this.prismaClient),
      new PrismaChallengeSearchRepository(this.prismaClient),
    );
    this.placesSvc = new PlacesService(
      new PrismaPlaceCRUDRepository(this.prismaClient),
      new PrismaPlaceSearchRepository(this.prismaClient),
    );
    this.playersSvc = new PlayersService(
      new PrismaPlayerCRUDRepository(this.prismaClient),
      new PrismaPlayerSearchRepository(this.prismaClient),
    );
  }

  async createChallenge(challenge: ChallengeDataObject): Promise<Challenge> {
    return this.challengesSvc.create(challenge);
  }
  async createPlace(place: PlaceDataObject): Promise<Place> {
    return this.placesSvc.create(place);
  }
  async createPlayer(player: PlayerDataObject): Promise<Player> {
    return this.playersSvc.create(player);
  }
  async getChallenges(maxResult: number = 1000): Promise<Challenge[]> {
    return this.challengesSvc.getAll({ pageSize: this.pageSize, maxResult: maxResult });
  }
  async getPlaces(maxResult: number = 1000): Promise<Place[]> {
    return this.placesSvc.getAll({ pageSize: this.pageSize, maxResult: maxResult });
  }
  async getPlayers(maxResult: number = 1000): Promise<Player[]> {
    return this.playersSvc.getAll({ pageSize: this.pageSize, maxResult: maxResult });
  }
  async getChallengeById(id: string): Promise<Challenge | undefined> {
    return this.challengesSvc.getById(id);
  }
  async getPlaceById(id: string): Promise<Place | undefined> {
    return this.placesSvc.getById(id);
  }
  async getPlayerById(id: string): Promise<Player | undefined> {
    return this.playersSvc.getById(id);
  }
  async updateChallenge(id: string, challenge: ChallengeDataObject): Promise<Challenge> {
    return this.challengesSvc.update(id, challenge);
  }
  async updatePlace(id: string, place: PlaceDataObject): Promise<Place> {
    return this.placesSvc.update(id, place);
  }
  async updatePlayer(id: string, player: PlayerDataObject): Promise<Player> {
    return this.playersSvc.update(id, player);
  }
  async deleteChallenge(id: string): Promise<void> {
    return this.challengesSvc.delete(id);
  }
  async deletePlace(id: string): Promise<void> {
    return this.placesSvc.delete(id);
  }
  async deletePlayer(id: string): Promise<void> {
    return this.playersSvc.delete(id);
  }
}

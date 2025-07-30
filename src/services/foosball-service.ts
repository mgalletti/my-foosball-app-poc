import { Challenge } from '../models/challenges.js';
import { Player } from '../models/players.js';
import { Place } from '../models/places.js';
import { ChallengeDataSchema } from '../schemas/challenge-schema.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { InMemoryChallengeRepository } from '../repositories/in-memory-challenge-repository.js';
import { logger } from '../utils/logger.js';

export interface FoosballServiceFacade {
  createChallenge(challenge: ChallengeDataSchema): Promise<Challenge>;
  getChallenges(): Promise<Challenge[]>;
  createPlace(place: PlaceDataObject): Promise<Place>;
  getPlaces(): Promise<Place[]>;
  createPlayer(player: PlayerDataObject): Promise<Player>;
  getPlayers(): Promise<Player[]>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  getPlaceById(id: string): Promise<Place | undefined>;
  getPlayerById(id: string): Promise<Player | undefined>;
  updateChallenge(id: string, challenge: ChallengeDataSchema): Promise<Challenge>;
  updatePlace(id: string, place: PlaceDataObject): Promise<Place>;
  updatePlayer(id: string, player: PlayerDataObject): Promise<Player>;
  deleteChallenge(id: string): Promise<void>;
  deletePlace(id: string): Promise<void>;
  deletePlayer(id: string): Promise<void>;
}

export class InMemoryFoosballService implements FoosballServiceFacade {
  private readonly challengeDB: InMemoryChallengeRepository;
  constructor() {
    this.challengeDB = new InMemoryChallengeRepository();
  }
  async createChallenge(challenge: ChallengeDataSchema): Promise<Challenge> {
    return this.challengeDB.createChallenge(
      challenge.name,
      challenge.placeId,
      challenge.date,
      challenge.time,
      challenge.ownerId,
      challenge.status,
      challenge.playersId,
    );
  }

  async getChallenges(): Promise<Challenge[]> {
    return this.challengeDB.getAllChallenges();
  }

  async createPlace(place: PlaceDataObject): Promise<Place> {
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

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    logger.info('Getting challenge by id', { id });
    throw new Error('Not implemented');
  }

  async getPlaceById(id: string): Promise<Place | undefined> {
    logger.info('Getting place by id', { id });
    throw new Error('Not implemented');
  }

  async getPlayerById(id: string): Promise<Player | undefined> {
    logger.info('Getting player by id', { id });
    throw new Error('Not implemented');
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async updateChallenge(id: string, challenge: ChallengeDataSchema): Promise<Challenge> {
    logger.info('Updating challenge', { id });
    throw new Error('Not implemented');
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async updatePlace(id: string, place: PlaceDataObject): Promise<Place> {
    logger.info('Updating place', { id });
    throw new Error('Not implemented');
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async updatePlayer(id: string, player: PlayerDataObject): Promise<Player> {
    logger.info('Updating player', { id });
    throw new Error('Not implemented');
  }

  async deleteChallenge(id: string): Promise<void> {
    logger.info('Deleting challenge', { id });
    throw new Error('Not implemented');
  }

  async deletePlace(id: string): Promise<void> {
    logger.info('Deleting place', { id });
    throw new Error('Not implemented');
  }

  async deletePlayer(id: string): Promise<void> {
    logger.info('Deleting player', { id });
    throw new Error('Not implemented');
  }
}

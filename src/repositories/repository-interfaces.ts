import { Challenge, ChallengeStatus, ChallengeTime } from '../models/challenges.js';
import { PaginationOptions } from '../models/common.js';
import { Coordinates, Place } from '../models/places.js';
import { Expertise, Player } from '../models/players.js';

export interface ChallengeRepository {
  createChallenge(
    name: string,
    placeId: string,
    date: Date,
    time: ChallengeTime,
    ownerId: string,
    status?: ChallengeStatus,
    playersId?: string[],
  ): Promise<Challenge>;

  getAllChallenges(): Promise<Challenge[]>;

  createPlace(name: string, coordinates: Coordinates): Promise<Place>;

  getAllPlaces(): Promise<Place[]>;

  createPlayer(name: string, expertise: Expertise, points: number): Promise<Player>;

  getAllPlayers(): Promise<Player[]>;
}

export interface PaginatedResult<T> {
  results: T[];
  nextToken?: string;
}

export interface BaseCRUDService<T, K, IDType> {
  getAll(pagination: PaginationOptions): Promise<PaginatedResult<T>>;
  getById(id: IDType): Promise<T | undefined>;
  create(data: K): Promise<T>;
  update(id: IDType, data: K): Promise<T>;
  delete(id: IDType): Promise<void>;
}

export interface BaseSearchService<T> {
  search(query: Record<string, any>, pagination: PaginationOptions): Promise<PaginatedResult<T>>;
}

export class BaseRepositoryService<T, K, IDType> implements BaseCRUDService<T, K, IDType>, BaseSearchService<T> {
  constructor(
    protected crudRepository: BaseCRUDService<T, K, IDType>,
    protected searchRepository: BaseSearchService<T>,
  ) {}

  async getAll(pagination: PaginationOptions): Promise<PaginatedResult<T>> {
    return this.crudRepository.getAll(pagination);
  }

  async getById(id: IDType): Promise<T | undefined> {
    return this.crudRepository.getById(id);
  }

  async create(data: K): Promise<T> {
    return this.crudRepository.create(data);
  }

  async update(id: IDType, data: K): Promise<T> {
    return this.crudRepository.update(id, data);
  }

  async delete(id: IDType): Promise<void> {
    return this.crudRepository.delete(id);
  }

  async search(query: Record<string, any>, pagination: PaginationOptions): Promise<PaginatedResult<T>> {
    return this.searchRepository.search(query, pagination);
  }
}

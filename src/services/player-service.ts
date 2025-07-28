import { Player } from '../models/players.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { BaseServiceInterface, ServicePaginationOptions } from './base-service.js';
import { BaseCRUDService, BaseSearchService } from '../repositories/repository-interfaces.js';
import { logger } from '../utils/logger.js';

export class PlayersService implements BaseServiceInterface<Player, PlayerDataObject> {
  constructor(
    private readonly playerCRUDRepository: BaseCRUDService<Player, PlayerDataObject, string>,
    private readonly playerSearchRepository: BaseSearchService<Player>,
  ) {}

  async getAll(pagination: ServicePaginationOptions): Promise<Player[]> {
    logger.info(`Getting all players`, { pagination });
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0) {
      return [];
    }
    const players = new Array<Player>();
    const pageSize = pagination.pageSize > maxResult ? maxResult : pagination.pageSize;

    let nextToken = undefined;
    do {
      const getAllResult = await this.playerCRUDRepository.getAll({
        pageSize: pageSize,
        maxResult: Math.max(maxResult - players.length, 0),
        nextToken: nextToken,
      });
      players.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return players;
  }

  async getById(id: string): Promise<Player | undefined> {
    return this.playerCRUDRepository.getById(id);
  }

  async create(data: PlayerDataObject): Promise<Player> {
    return this.playerCRUDRepository.create(data);
  }

  async update(id: string, data: PlayerDataObject): Promise<Player> {
    return this.playerCRUDRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.playerCRUDRepository.delete(id);
  }

  async search(query: Record<string, any>, pagination: ServicePaginationOptions): Promise<Player[]> {
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0 || pagination.pageSize < 0) {
      return [];
    }
    const players = new Array<Player>();
    const pageSize = Math.min(pagination.pageSize, maxResult);

    let nextToken = undefined;
    do {
      const getAllResult = await this.playerSearchRepository.search(query, {
        pageSize: pageSize,
        maxResult: Math.max(maxResult - players.length, 0),
        nextToken: nextToken,
      });
      players.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return players;
  }
}

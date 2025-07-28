import { Place } from '../models/places.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { BaseServiceInterface, ServicePaginationOptions } from './base-service.js';
import { BaseCRUDService, BaseSearchService } from '../repositories/repository-interfaces.js';
import { logger } from '../utils/logger.js';

export class PlacesService implements BaseServiceInterface<Place, PlaceDataObject> {
  constructor(
    private readonly placeCRUDRepository: BaseCRUDService<Place, PlaceDataObject, string>,
    private readonly placeSearchRepository: BaseSearchService<Place>,
  ) {}

  async getAll(pagination: ServicePaginationOptions): Promise<Place[]> {
    logger.info(`Getting all places`, { pagination });
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0) {
      return [];
    }
    const places = new Array<Place>();
    const pageSize = pagination.pageSize > maxResult ? maxResult : pagination.pageSize;

    let nextToken = undefined;
    do {
      const getAllResult = await this.placeCRUDRepository.getAll({
        pageSize: pageSize,
        maxResult: Math.max(maxResult - places.length, 0),
        nextToken: nextToken,
      });
      places.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return places;
  }

  async getById(id: string): Promise<Place | undefined> {
    return this.placeCRUDRepository.getById(id);
  }

  async create(data: PlaceDataObject): Promise<Place> {
    return this.placeCRUDRepository.create(data);
  }

  async update(id: string, data: PlaceDataObject): Promise<Place> {
    return this.placeCRUDRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.placeCRUDRepository.delete(id);
  }

  async search(query: Record<string, any>, pagination: ServicePaginationOptions): Promise<Place[]> {
    const maxResult = pagination.maxResult || 1000;
    if (maxResult < 0 || pagination.pageSize < 0) {
      return [];
    }
    const places = new Array<Place>();
    const pageSize = Math.min(pagination.pageSize, maxResult);

    let nextToken = undefined;
    do {
      const getAllResult = await this.placeSearchRepository.search(query, {
        pageSize: pageSize,
        maxResult: Math.max(maxResult - places.length, 0),
        nextToken: nextToken,
      });
      places.push(...getAllResult.results);
      nextToken = getAllResult.nextToken;
    } while (nextToken);

    return places;
  }
}

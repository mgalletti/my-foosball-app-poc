export interface ServicePaginationOptions {
  pageSize: number;
  maxResult?: number;
}

export interface BaseServiceInterface<T, K> {
  create(data: K): Promise<T>;
  getAll(pagination: ServicePaginationOptions): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  delete(id: string): Promise<void>;
  update(id: string, data: K): Promise<T>;
  search(query: Record<string, any>, pagination: ServicePaginationOptions): Promise<T[]>;
}

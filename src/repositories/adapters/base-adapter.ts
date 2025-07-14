export interface QueryOptions {
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface BaseAdapter<T> {
  initialize(): Promise<this>;
  create(data: Partial<T>): Promise<string>;
  findById(id: string): Promise<T | null>;
  findAll(query?: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  getObjectName(): string;
}

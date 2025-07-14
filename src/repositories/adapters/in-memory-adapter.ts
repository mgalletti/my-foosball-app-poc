import { BaseAdapter, QueryOptions } from './base-adapter.js';
import { createHash } from 'crypto';

type WithId<IdType = string> = {
  id?: IdType;
  name?: string;
};

export class InMemoryAdapter<T extends WithId> implements BaseAdapter<T> {
  protected db: Map<string, T> = new Map<string, T>();
  private objectName: string;

  constructor(objectName: string) {
    this.objectName = objectName;
  }

  getObjectName(): string {
    return this.objectName;
  }

  async initialize(): Promise<this> {
    return this;
  }

  async create(data: Partial<T>): Promise<string> {
    const id_suffix = createHash('sha256')
      .update(data.name || Date.now().toString())
      .digest('hex')
      .substring(0, 8);
    const id = `${this.objectName.toLowerCase()}_${id_suffix}`;
    const item = { id: id, ...data } as T;
    if (this.db.get(id)) throw new ReferenceError(`${this.objectName} with id '${id}' already exists`);
    this.db.set(id, item);
    return id;
  }

  async findById(id: string): Promise<T | null> {
    return this.db.get(id) || null;
  }
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async findAll(query?: Record<string, any>, options?: QueryOptions): Promise<T[]> {
    // Convert Map values to array
    let results = Array.from(this.db.values());

    // Apply query filtering if provided
    if (query) {
      results = results.filter((item) => {
        return Object.entries(query).every(([key, value]) => item[key as keyof T] === value);
      });
    }

    return results;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const item = this.db.get(id);
    if (!item) return null;

    const updated = { ...item, ...data };
    this.db.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.db.delete(id);
  }
}

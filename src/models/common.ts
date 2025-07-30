export interface CommonAttributes {
  id: string;
  name: string;
}

export interface PaginationOptions {
  pageSize: number;
  maxResult: number;
  nextToken?: string;
}

export enum RepositoryOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  READ = 'READ',
  DELETE = 'DELETE',
  UNKNOWN = 'UNKNOWN',
}

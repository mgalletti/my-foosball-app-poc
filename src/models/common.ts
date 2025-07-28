export interface CommonAttributes {
  id: string;
  name: string;
}

export interface PaginationOptions {
  pageSize: number;
  maxResult: number;
  nextToken?: string;
}

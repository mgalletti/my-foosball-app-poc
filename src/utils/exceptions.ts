import { RepositoryOperationType } from '../models/common.js';

export interface FoosballServiceErrorProps {
  message: string;
  originalException: Error;
}

export class FoosballServiceError extends Error {
  constructor(
    message: string,
    readonly originalException: Error,
  ) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string, overrideMessage?: string) {
    const msg = overrideMessage ? overrideMessage! : `${resource} with id '${id}' not found`;
    super(msg);
    this.name = 'NotFoundError';
  }
}

export class RepositoryOperationError extends FoosballServiceError {
  constructor(
    message: string,
    readonly originalException: Error,
    protected readonly operationType: RepositoryOperationType = RepositoryOperationType.UNKNOWN,
  ) {
    super(message, originalException);
  }
}

export class GenericOperationError extends RepositoryOperationError {}

export class DeleteOperationError extends RepositoryOperationError {
  constructor(
    message: string,
    readonly originalException: Error,
  ) {
    super(message, originalException, RepositoryOperationType.DELETE);
  }
}

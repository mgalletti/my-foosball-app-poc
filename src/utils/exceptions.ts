export class NotFoundError extends Error {
  constructor(resource: string, id: string, overrideMessage?: string) {
    const msg = overrideMessage ? overrideMessage! : `${resource} with id '${id}' not found`;
    super(msg);
    this.name = 'NotFoundError';
  }
}

export class NotFoundError extends Error {
    constructor(resource, id, overrideMessage) {
        const msg = overrideMessage ? overrideMessage : `${resource} with id '${id}' not found`;
        super(msg);
        this.name = 'NotFoundError';
    }
}

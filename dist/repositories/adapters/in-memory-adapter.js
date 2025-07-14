import { createHash } from 'crypto';
export class InMemoryAdapter {
    constructor(objectName) {
        this.db = new Map();
        this.objectName = objectName;
    }
    getObjectName() {
        return this.objectName;
    }
    async initialize() {
        return this;
    }
    async create(data) {
        const id_suffix = createHash('sha256')
            .update(data.name || Date.now().toString())
            .digest('hex')
            .substring(0, 8);
        const id = `${this.objectName.toLowerCase()}_${id_suffix}`;
        const item = { id: id, ...data };
        if (this.db.get(id))
            throw new ReferenceError(`${this.objectName} with id '${id}' already exists`);
        this.db.set(id, item);
        return id;
    }
    async findById(id) {
        return this.db.get(id) || null;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    async findAll(query, options) {
        // Convert Map values to array
        let results = Array.from(this.db.values());
        // Apply query filtering if provided
        if (query) {
            results = results.filter((item) => {
                return Object.entries(query).every(([key, value]) => item[key] === value);
            });
        }
        return results;
    }
    async update(id, data) {
        const item = this.db.get(id);
        if (!item)
            return null;
        const updated = { ...item, ...data };
        this.db.set(id, updated);
        return updated;
    }
    async delete(id) {
        return this.db.delete(id);
    }
}

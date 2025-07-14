// import mongoose, { Model, Schema } from 'mongoose';
// import { BaseAdapter, QueryOptions } from './base-adapter.js';

// export class MongoDBAdapter<T> extends BaseAdapter<T> {
//   private model: Model<T & mongoose.Document> | null = null;

//   constructor(modelName: string, schema: Record<string, any>) {
//     super(modelName, schema);
//   }

//   async initialize(): Promise<this> {
//     const mongooseSchema = new Schema(this.schema, {
//       timestamps: true
//     });

//     this.model = mongoose.model<T & mongoose.Document>(
//       this.modelName,
//       mongooseSchema
//     );
//     return this;
//   }

//   async create(data: Partial<T>): Promise<T> {
//     if (!this.model) throw new Error('Model not initialized');
//     const document = new this.model(data);
//     return (await document.save()).toObject();
//   }

//   async findById(id: string): Promise<T | null> {
//     if (!this.model) throw new Error('Model not initialized');
//     const document = await this.model.findById(id);
//     return document ? document.toObject() : null;
//   }

//   async findAll(query: Record<string, any> = {}, options: QueryOptions = {}): Promise<T[]> {
//     if (!this.model) throw new Error('Model not initialized');

//     let queryBuilder = this.model.find(query);

//     if (options.skip) queryBuilder = queryBuilder.skip(options.skip);
//     if (options.limit) queryBuilder = queryBuilder.limit(options.limit);
//     if (options.sort) queryBuilder = queryBuilder.sort(options.sort);

//     const documents = await queryBuilder.exec();
//     return documents.map(doc => doc.toObject());
//   }

//   async update(id: string, data: Partial<T>): Promise<T | null> {
//     if (!this.model) throw new Error('Model not initialized');
//     const document = await this.model.findByIdAndUpdate(id, data, { new: true });
//     return document ? document.toObject() : null;
//   }

//   async delete(id: string): Promise<boolean> {
//     if (!this.model) throw new Error('Model not initialized');
//     const result = await this.model.findByIdAndDelete(id);
//     return result !== null;
//   }
// }

// import * as dynamoose from 'dynamoose';
// import { Model } from 'dynamoose/dist/Model';
// import { Item } from "dynamoose/dist/Item";
// import { v4 as uuidv4 } from 'uuid';
// import { BaseAdapter, QueryOptions } from './base-adapter.js';
export {};
// export class DynamoDBAdapter<T> extends BaseAdapter<T> {
//   private model: Model<T> | null = null;
//   constructor(modelName: string, schema: Record<string, any>) {
//     super(modelName, schema);
//   }
//   async initialize(): Promise<this> {
//     const dynamooseSchema = new dynamoose.Schema(this._convertSchema());
//     this.model = dynamoose.model<T & Item>(this.modelName, dynamooseSchema);
//     return this;
//   }
//   private _convertSchema(): Record<string, any> {
//     // This is a simplified conversion - you might need more complex logic
//     const dynamoSchema: Record<string, any> = {
//       id: {
//         type: String,
//         hashKey: true,
//         default: () => uuidv4()
//       }
//     };
//     // Map other fields from schema to Dynamoose format
//     Object.entries(this.schema).forEach(([key, value]) => {
//       if (key !== 'id') {
//         dynamoSchema[key] = this._mapSchemaType(value);
//       }
//     });
//     return dynamoSchema;
//   }
//   private _mapSchemaType(schemaType: any): Record<string, any> {
//     // Simple mapping logic - expand as needed
//     if (schemaType.type === Date) {
//       return { type: Date };
//     } else if (schemaType.type === Number) {
//       return { type: Number };
//     } else if (schemaType.type === String) {
//       return { type: String };
//     } else if (Array.isArray(schemaType)) {
//       return { type: Array };
//     } else if (typeof schemaType === 'object') {
//       return { type: Object };
//     }
//     return { type: String };
//   }
//   async create(data: Partial<T>): Promise<T> {
//     if (!this.model) throw new Error('Model not initialized');
//     return await this.model.create(data as any);
//   }
//   async findById(id: string): Promise<T | null> {
//     if (!this.model) throw new Error('Model not initialized');
//     try {
//       return await this.model.get(id);
//     } catch (error) {
//       return null;
//     }
//   }
//   async findAll(query: Record<string, any> = {}, options: QueryOptions = {}): Promise<T[]> {
//     if (!this.model) throw new Error('Model not initialized');
//     // Simple implementation - might need more complex query translation
//     let scanOperation = this.model.scan();
//     // Apply filters if provided
//     Object.entries(query).forEach(([key, value]) => {
//       scanOperation = scanOperation.filter(key).eq(value);
//     });
//     // Apply pagination if provided
//     if (options.limit) {
//       scanOperation = scanOperation.limit(options.limit);
//     }
//     const result = await scanOperation.exec();
//     return result;
//   }
//   async update(id: string, data: Partial<T>): Promise<T | null> {
//     if (!this.model) throw new Error('Model not initialized');
//     try {
//       return await this.model.update({ id }, data as any);
//     } catch (error) {
//       return null;
//     }
//   }
//   async delete(id: string): Promise<boolean> {
//     if (!this.model) throw new Error('Model not initialized');
//     try {
//       await this.model.delete({ id });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
// }

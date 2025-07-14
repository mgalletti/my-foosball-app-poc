import { z } from 'zod';
import { Expertise } from '../models/players.js';
import { idAttributeSchema } from './common-schema.js';

export const playerDataSchema = z.object({
  name: z.string(),
  expertise: z.nativeEnum(Expertise),
  points: z.number().min(0).optional().default(0),
});

export const playerObjectSchema = playerDataSchema.merge(idAttributeSchema);

export type PlayerDataObject = z.infer<typeof playerDataSchema>;

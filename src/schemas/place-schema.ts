import { z } from 'zod';
import { idAttributeSchema } from './common-schema.js';
import { NearbyPlacesUnit } from '../models/places.js';

export const coordinatesSchema = z.object({
  lat: z.number(),
  long: z.number(),
});

export const placeDataSchema = z.object({
  name: z.string(),
  coordinates: coordinatesSchema,
});

export const placeObjectSchema = placeDataSchema.merge(idAttributeSchema);
export type PlaceDataObject = z.infer<typeof placeDataSchema>;

export const nearbyPlacesRequestSchema = z.object({
  coordinates: coordinatesSchema,
  radius: z.nativeEnum(NearbyPlacesUnit).default(NearbyPlacesUnit.KM),
  unit: z.string(),
});
export type NearbyPlacesRequest = z.infer<typeof nearbyPlacesRequestSchema>;

import { z } from 'zod';
import { ChallengeStatus, ChallengeTime } from '../models/challenges.js';
import { idAttributeSchema } from './common-schema.js';
export const challengeDataSchema = z.object({
    name: z.string(),
    placeId: z.string(),
    date: z.string().transform((str) => new Date(str)),
    status: z.nativeEnum(ChallengeStatus).default(ChallengeStatus.OPEN),
    time: z.nativeEnum(ChallengeTime),
    ownerId: z.string(),
    playersId: z.array(z.string()).optional(),
});
// CreateChallenge API
// Request
export const createChallengeRequestSchemaV2 = z.object({
    placeId: z.string(),
    name: z.string(),
    date: z.string().transform((str) => new Date(str)),
    status: z.nativeEnum(ChallengeStatus).default(ChallengeStatus.OPEN),
    time: z.nativeEnum(ChallengeTime),
    ownerId: z.string(),
    playersId: z.array(z.string()).optional(),
});
export const challengeObjectSchema = challengeDataSchema.merge(idAttributeSchema);

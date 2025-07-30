import { z } from 'zod';
import { ChallengeStatus, ChallengeTime } from '../models/challenges.js';

export const challengeDataSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  date: z.string().transform((str) => new Date(str)),
  status: z.nativeEnum(ChallengeStatus).default(ChallengeStatus.OPEN),
  time: z.nativeEnum(ChallengeTime),
  ownerId: z.string(),
  playersId: z.array(z.string()).optional(),
});

export type ChallengeDataSchema = z.infer<typeof challengeDataSchema>;

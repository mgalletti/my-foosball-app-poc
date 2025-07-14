import { z } from 'zod';

export const idAttributeSchema = z.object({
  id: z.string(),
});

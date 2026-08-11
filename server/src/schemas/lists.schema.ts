import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().max(200).optional(),
});

export const updateListSchema = createListSchema.partial();

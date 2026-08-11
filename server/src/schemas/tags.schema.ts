import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(30),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a hex color like #e05d44'),
});

export const updateTagSchema = createTagSchema.partial();

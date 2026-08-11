import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)');

export const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  listId: z.string().min(1),
  tagIds: z.array(z.string()).default([]),
  dueDate: isoDate.optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  listId: z.string().min(1).optional(),
  tagIds: z.array(z.string()).optional(),
  dueDate: isoDate.nullable().optional(),
});

export const todoQuerySchema = z.object({
  status: z.enum(['open', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tagId: z.string().optional(),
  listId: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(['createdAt']).default('createdAt'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

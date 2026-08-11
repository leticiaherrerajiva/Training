import { Router } from 'express';
import { z } from 'zod';
import { parseWith } from '../lib/validate';
import { sendData } from '../lib/respond';
import { activityService } from '../services/activity.service';

const activityQuerySchema = z.object({
  todoId: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const activityRouter = Router();

activityRouter.get('/', (req, res) => {
  const query = parseWith(activityQuerySchema, req.query);
  sendData(res, activityService.list(query));
});

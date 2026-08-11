import { Router } from 'express';
import { z } from 'zod';
import { parseWith } from '../lib/validate';
import { sendData } from '../lib/respond';
import { inspirationService } from '../services/inspiration.service';

const inspirationQuerySchema = z.object({
  category: z.string().default('grit'),
});

export const inspirationRouter = Router();

inspirationRouter.get('/', async (req, res) => {
  const { category } = parseWith(inspirationQuerySchema, req.query);
  sendData(res, await inspirationService.getQuote(category));
});

import { Router } from 'express';
import { sendData } from '../lib/respond';
import { statsService } from '../services/stats.service';

export const statsRouter = Router();

statsRouter.get('/summary', (_req, res) => {
  sendData(res, statsService.summary());
});

statsRouter.get('/tags', (_req, res) => {
  sendData(res, statsService.byTag());
});

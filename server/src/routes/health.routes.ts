import { Router } from 'express';
import { sendData } from '../lib/respond';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  sendData(res, { status: 'ok', uptimeSeconds: Math.round(process.uptime()) });
});

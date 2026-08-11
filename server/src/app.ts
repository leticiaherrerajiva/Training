import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiRouter } from './routes/index';

/** App factory, separate from the listener so tests can drive it with supertest. */
export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);
  app.use('/api', apiRouter);
  app.use(errorHandler);
  return app;
}

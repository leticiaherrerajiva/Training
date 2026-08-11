import { createApp } from './app';
import { config } from './config';
import { ensureDb } from './db/store';
import { logger } from './lib/logger';

ensureDb();

createApp().listen(config.port, () => {
  logger.info('index', `TaskBoard API listening on http://localhost:${config.port}`);
});

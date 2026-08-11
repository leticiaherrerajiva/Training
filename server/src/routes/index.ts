import { Router } from 'express';
import { activityRouter } from './activity.routes';
import { healthRouter } from './health.routes';
import { inspirationRouter } from './inspiration.routes';
import { listsRouter } from './lists.routes';
import { statsRouter } from './stats.routes';
import { tagsRouter } from './tags.routes';
import { todosRouter } from './todos.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/todos', todosRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/lists', listsRouter);
apiRouter.use('/activity', activityRouter);
apiRouter.use('/stats', statsRouter);
apiRouter.use('/inspiration', inspirationRouter);

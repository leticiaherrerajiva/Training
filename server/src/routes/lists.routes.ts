import { Router } from 'express';
import { parseWith } from '../lib/validate';
import { sendData } from '../lib/respond';
import { createListSchema, updateListSchema } from '../schemas/lists.schema';
import { listsService } from '../services/lists.service';

export const listsRouter = Router();

listsRouter.get('/', (_req, res) => {
  sendData(res, listsService.list());
});

listsRouter.get('/:id', (req, res) => {
  sendData(res, listsService.getById(req.params.id));
});

listsRouter.post('/', (req, res) => {
  const input = parseWith(createListSchema, req.body);
  sendData(res, listsService.create(input), { status: 201 });
});

listsRouter.patch('/:id', (req, res) => {
  const changes = parseWith(updateListSchema, req.body);
  sendData(res, listsService.update(req.params.id, changes));
});

listsRouter.delete('/:id', (req, res) => {
  listsService.remove(req.params.id);
  sendData(res, { deleted: true });
});

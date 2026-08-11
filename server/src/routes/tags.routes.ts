import { Router } from 'express';
import { parseWith } from '../lib/validate';
import { sendData } from '../lib/respond';
import { createTagSchema, updateTagSchema } from '../schemas/tags.schema';
import { tagsService } from '../services/tags.service';

export const tagsRouter = Router();

tagsRouter.get('/', (_req, res) => {
  sendData(res, tagsService.list());
});

tagsRouter.get('/:id', (req, res) => {
  sendData(res, tagsService.getById(req.params.id));
});

tagsRouter.post('/', (req, res) => {
  const input = parseWith(createTagSchema, req.body);
  sendData(res, tagsService.create(input), { status: 201 });
});

tagsRouter.patch('/:id', (req, res) => {
  const changes = parseWith(updateTagSchema, req.body);
  sendData(res, tagsService.update(req.params.id, changes));
});

tagsRouter.delete('/:id', (req, res) => {
  tagsService.remove(req.params.id);
  sendData(res, { deleted: true });
});

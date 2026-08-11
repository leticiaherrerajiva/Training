import { Router } from 'express';
import { parseWith } from '../lib/validate';
import { sendData } from '../lib/respond';
import { createTodoSchema, todoQuerySchema, updateTodoSchema } from '../schemas/todos.schema';
import { todosService } from '../services/todos.service';

export const todosRouter = Router();

todosRouter.get('/', (req, res) => {
  const query = parseWith(todoQuerySchema, req.query);
  const { todos, meta } = todosService.list(query);
  sendData(res, todos, { meta });
});

todosRouter.get('/:id', (req, res) => {
  sendData(res, todosService.getById(req.params.id));
});

todosRouter.post('/', (req, res) => {
  const input = parseWith(createTodoSchema, req.body);
  sendData(res, todosService.create(input), { status: 201 });
});

todosRouter.patch('/:id', (req, res) => {
  const changes = parseWith(updateTodoSchema, req.body);
  sendData(res, todosService.update(req.params.id, changes));
});

todosRouter.post('/:id/complete', (req, res) => {
  sendData(res, todosService.complete(req.params.id));
});

todosRouter.post('/:id/reopen', (req, res) => {
  sendData(res, todosService.reopen(req.params.id));
});

todosRouter.delete('/:id', (req, res) => {
  todosService.remove(req.params.id);
  sendData(res, { deleted: true });
});

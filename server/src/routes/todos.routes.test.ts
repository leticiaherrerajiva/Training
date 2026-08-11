import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { makeTestDb } from '../testing/helpers';

// NOTE: covers the happy paths. Query parameters (filters, search,
// pagination) do not have route tests yet.
describe('todos routes', () => {
  let db: ReturnType<typeof makeTestDb>;
  const app = createApp();

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('GET /api/todos returns todos with page meta', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta).toMatchObject({ page: 1, pageSize: 20 });
  });

  it('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'From the API', listId: 'list_a' });
    expect(res.status).toBe(201);
    expect(res.body.data.priority).toBe('medium');
  });

  it('POST /api/todos/:id/complete marks it done', async () => {
    const res = await request(app).post('/api/todos/todo_a/complete');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('done');
  });

  it('DELETE /api/todos/:id removes it', async () => {
    const res = await request(app).delete('/api/todos/todo_a');
    expect(res.status).toBe(200);
    const after = await request(app).get('/api/todos/todo_a');
    expect(after.status).toBe(404);
  });
});

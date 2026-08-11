import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { makeTestDb } from '../testing/helpers';

describe('lists routes', () => {
  let db: ReturnType<typeof makeTestDb>;
  const app = createApp();

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('GET /api/lists returns lists in the data envelope', async () => {
    const res = await request(app).get('/api/lists');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('POST /api/lists creates a list and returns 201', async () => {
    const res = await request(app).post('/api/lists').send({ name: 'Gamma' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Gamma');
  });

  it('POST /api/lists rejects an empty name', async () => {
    const res = await request(app).post('/api/lists').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('DELETE /api/lists/:id refuses when the list still has todos', async () => {
    const res = await request(app).delete('/api/lists/list_a');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});

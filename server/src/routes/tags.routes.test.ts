import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app';
import { makeTestDb } from '../testing/helpers';

describe('tags routes', () => {
  let db: ReturnType<typeof makeTestDb>;
  const app = createApp();

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('GET /api/tags returns tags in the data envelope', async () => {
    const res = await request(app).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('GET /api/tags/:id returns 404 in the error envelope for a missing tag', async () => {
    const res = await request(app).get('/api/tags/tag_nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('tag_nope');
  });

  it('POST /api/tags creates a tag and returns 201', async () => {
    const res = await request(app).post('/api/tags').send({ name: 'fresh', color: '#00ff00' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toMatch(/^tag_/);
  });

  it('POST /api/tags rejects an invalid color with VALIDATION_ERROR details', async () => {
    const res = await request(app).post('/api/tags').send({ name: 'bad', color: 'green' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toBeTruthy();
  });

  it('POST /api/tags rejects a duplicate name with 409', async () => {
    const res = await request(app).post('/api/tags').send({ name: 'alpha', color: '#00ff00' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('PATCH /api/tags/:id updates a tag', async () => {
    const res = await request(app).patch('/api/tags/tag_a').send({ color: '#123456' });
    expect(res.status).toBe(200);
    expect(res.body.data.color).toBe('#123456');
  });

  it('DELETE /api/tags/:id refuses to delete a tag in use', async () => {
    const res = await request(app).delete('/api/tags/tag_a');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('DELETE /api/tags/:id deletes an unused tag', async () => {
    const res = await request(app).delete('/api/tags/tag_unused');
    expect(res.status).toBe(200);
    expect(res.body.data.deleted).toBe(true);
  });
});

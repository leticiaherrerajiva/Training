import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { todosService } from './todos.service';
import { NotFoundError, ValidationError } from '../lib/errors';
import { activityService } from './activity.service';
import { makeTestDb } from '../testing/helpers';

// NOTE: covers the CRUD happy paths. Filtering, search, and pagination in
// todosService.list() do not have tests yet.
describe('todosService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('gets a todo by id', () => {
    expect(todosService.getById('todo_a').title).toBe('First fixture todo');
  });

  it('throws NotFoundError for a missing todo', () => {
    expect(() => todosService.getById('todo_nope')).toThrow(NotFoundError);
  });

  it('creates a todo and records activity', () => {
    const todo = todosService.create({
      title: 'Brand new',
      priority: 'high',
      listId: 'list_a',
      tagIds: ['tag_a'],
    });
    expect(todo.id).toMatch(/^todo_/);
    expect(todo.status).toBe('open');
    const feed = activityService.list({ todoId: todo.id, limit: 10 });
    expect(feed[0]?.action).toBe('created');
  });

  it('rejects a todo referencing a missing list', () => {
    expect(() =>
      todosService.create({ title: 'Orphan', priority: 'low', listId: 'list_nope', tagIds: [] }),
    ).toThrow(ValidationError);
  });

  it('rejects a todo referencing a missing tag', () => {
    expect(() =>
      todosService.create({
        title: 'Bad tag',
        priority: 'low',
        listId: 'list_a',
        tagIds: ['tag_nope'],
      }),
    ).toThrow(ValidationError);
  });

  it('updates a todo', () => {
    const updated = todosService.update('todo_a', { title: 'Renamed', priority: 'low' });
    expect(updated.title).toBe('Renamed');
    expect(updated.priority).toBe('low');
  });

  it('completes a todo and stamps completedAt', () => {
    const done = todosService.complete('todo_a');
    expect(done.status).toBe('done');
    expect(done.completedAt).toBeTruthy();
  });

  it('reopens a completed todo and clears completedAt', () => {
    todosService.complete('todo_a');
    const reopened = todosService.reopen('todo_a');
    expect(reopened.status).toBe('open');
    expect(reopened.completedAt).toBeUndefined();
  });

  it('removes a todo and records the deletion', () => {
    todosService.remove('todo_a');
    expect(() => todosService.getById('todo_a')).toThrow(NotFoundError);
    const feed = activityService.list({ todoId: 'todo_a', limit: 10 });
    expect(feed[0]?.action).toBe('deleted');
  });
});

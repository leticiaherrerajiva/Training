import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { listsService } from './lists.service';
import { ConflictError, NotFoundError } from '../lib/errors';
import { makeTestDb } from '../testing/helpers';

describe('listsService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('lists lists sorted by name', () => {
    expect(listsService.list().map((l) => l.name)).toEqual(['Alpha', 'Beta']);
  });

  it('throws NotFoundError for a missing list', () => {
    expect(() => listsService.getById('list_nope')).toThrow(NotFoundError);
  });

  it('creates a list', () => {
    const list = listsService.create({ name: 'Gamma', description: 'Third' });
    expect(list.id).toMatch(/^list_/);
    expect(listsService.getById(list.id).description).toBe('Third');
  });

  it('updates a list', () => {
    expect(listsService.update('list_b', { name: 'Renamed' }).name).toBe('Renamed');
  });

  it('refuses to remove a list that still has todos', () => {
    expect(() => listsService.remove('list_a')).toThrow(ConflictError);
  });

  it('removes an empty list after its todos are gone', () => {
    const list = listsService.create({ name: 'Empty' });
    listsService.remove(list.id);
    expect(() => listsService.getById(list.id)).toThrow(NotFoundError);
  });
});

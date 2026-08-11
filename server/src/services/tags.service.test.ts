import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { tagsService } from './tags.service';
import { ConflictError, NotFoundError } from '../lib/errors';
import { makeTestDb } from '../testing/helpers';

describe('tagsService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('lists tags sorted by name', () => {
    const names = tagsService.list().map((t) => t.name);
    expect(names).toEqual(['alpha', 'beta', 'unused']);
  });

  it('gets a tag by id', () => {
    expect(tagsService.getById('tag_b').name).toBe('beta');
  });

  it('throws NotFoundError for a missing tag', () => {
    expect(() => tagsService.getById('tag_nope')).toThrow(NotFoundError);
  });

  it('creates a tag with a generated id', () => {
    const tag = tagsService.create({ name: 'fresh', color: '#00ff00' });
    expect(tag.id).toMatch(/^tag_/);
    expect(tagsService.getById(tag.id).name).toBe('fresh');
  });

  it('rejects a duplicate tag name (case-insensitive)', () => {
    expect(() => tagsService.create({ name: 'ALPHA', color: '#00ff00' })).toThrow(ConflictError);
  });

  it('updates a tag', () => {
    const updated = tagsService.update('tag_a', { color: '#999999' });
    expect(updated.color).toBe('#999999');
  });

  it('rejects renaming a tag to an existing name', () => {
    expect(() => tagsService.update('tag_a', { name: 'beta' })).toThrow(ConflictError);
  });

  it('removes an unused tag', () => {
    tagsService.remove('tag_unused');
    expect(() => tagsService.getById('tag_unused')).toThrow(NotFoundError);
  });

  it('refuses to remove a tag that is assigned to todos', () => {
    expect(() => tagsService.remove('tag_a')).toThrow(ConflictError);
  });
});

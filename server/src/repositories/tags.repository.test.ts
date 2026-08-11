import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { tagsRepository } from './tags.repository';
import { makeTestDb } from '../testing/helpers';

describe('tagsRepository', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('finds all tags', () => {
    expect(tagsRepository.findAll()).toHaveLength(3);
  });

  it('finds a tag by id', () => {
    expect(tagsRepository.findById('tag_a')?.name).toBe('alpha');
  });

  it('returns undefined for a missing id', () => {
    expect(tagsRepository.findById('tag_nope')).toBeUndefined();
  });

  it('inserts a tag and persists it', () => {
    tagsRepository.insert({
      id: 'tag_new',
      name: 'new',
      color: '#abcdef',
      createdAt: '2026-02-01T00:00:00.000Z',
    });
    expect(tagsRepository.findById('tag_new')?.color).toBe('#abcdef');
    expect(tagsRepository.findAll()).toHaveLength(4);
  });

  it('updates a tag in place', () => {
    const updated = tagsRepository.update('tag_a', { name: 'renamed' });
    expect(updated?.name).toBe('renamed');
    expect(tagsRepository.findById('tag_a')?.name).toBe('renamed');
  });

  it('returns undefined when updating a missing tag', () => {
    expect(tagsRepository.update('tag_nope', { name: 'x' })).toBeUndefined();
  });

  it('removes a tag', () => {
    expect(tagsRepository.remove('tag_unused')).toBe(true);
    expect(tagsRepository.findById('tag_unused')).toBeUndefined();
  });

  it('returns false when removing a missing tag', () => {
    expect(tagsRepository.remove('tag_nope')).toBe(false);
  });
});

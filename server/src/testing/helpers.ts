import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Db } from '../db/store';

/**
 * Test fixture: a small, deterministic dataset that is independent of the
 * real seed in server/data/seed.json. Tests must never read or write the
 * real data directory — makeTestDb() points DATA_DIR at a fresh temp dir.
 */
const FIXTURE: Db = {
  lists: [
    { id: 'list_a', name: 'Alpha', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'list_b', name: 'Beta', createdAt: '2026-01-02T00:00:00.000Z' },
  ],
  tags: [
    { id: 'tag_a', name: 'alpha', color: '#111111', createdAt: '2026-01-01T00:00:00.000Z' },
    { id: 'tag_b', name: 'beta', color: '#222222', createdAt: '2026-01-02T00:00:00.000Z' },
    { id: 'tag_unused', name: 'unused', color: '#333333', createdAt: '2026-01-03T00:00:00.000Z' },
  ],
  todos: [
    {
      id: 'todo_a',
      title: 'First fixture todo',
      status: 'open',
      priority: 'medium',
      listId: 'list_a',
      tagIds: ['tag_a'],
      createdAt: '2026-01-10T00:00:00.000Z',
      updatedAt: '2026-01-10T00:00:00.000Z',
    },
    {
      id: 'todo_b',
      title: 'Second fixture todo',
      notes: 'Has notes',
      status: 'open',
      priority: 'high',
      listId: 'list_a',
      tagIds: ['tag_a', 'tag_b'],
      dueDate: '2026-02-01',
      createdAt: '2026-01-11T00:00:00.000Z',
      updatedAt: '2026-01-11T00:00:00.000Z',
    },
    {
      id: 'todo_c',
      title: 'Completed fixture todo',
      status: 'done',
      priority: 'low',
      listId: 'list_b',
      tagIds: [],
      createdAt: '2026-01-12T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
      completedAt: '2026-01-15T00:00:00.000Z',
    },
  ],
  activity: [
    {
      id: 'act_a',
      todoId: 'todo_a',
      todoTitle: 'First fixture todo',
      action: 'created',
      at: '2026-01-10T00:00:00.000Z',
    },
  ],
};

/**
 * Point the server at a fresh temp data directory seeded with the fixture.
 * Call in beforeEach; call the returned cleanup in afterEach.
 */
export function makeTestDb(): { cleanup: () => void } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'taskboard-test-'));
  fs.writeFileSync(path.join(dir, 'seed.json'), JSON.stringify(FIXTURE, null, 2));
  fs.writeFileSync(path.join(dir, 'db.json'), JSON.stringify(FIXTURE, null, 2));
  const previous = process.env.DATA_DIR;
  process.env.DATA_DIR = dir;
  return {
    cleanup() {
      if (previous === undefined) {
        delete process.env.DATA_DIR;
      } else {
        process.env.DATA_DIR = previous;
      }
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

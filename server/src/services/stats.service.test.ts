import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { statsService } from './stats.service';
import { todosService } from './todos.service';
import { makeTestDb } from '../testing/helpers';

describe('statsService', () => {
  let db: ReturnType<typeof makeTestDb>;

  beforeEach(() => {
    db = makeTestDb();
  });

  afterEach(() => {
    db.cleanup();
  });

  it('summarizes totals, status, and priority breakdown', () => {
    const summary = statsService.summary();
    expect(summary.total).toBe(3);
    expect(summary.open).toBe(2);
    expect(summary.done).toBe(1);
    expect(summary.byPriority).toEqual({ low: 1, medium: 1, high: 1 });
  });

  it('flags an open todo with a past due date as overdue', () => {
    expect(statsService.summary().overdue).toBe(1);
  });

  it('counts a todo completed just now toward completedThisWeek', () => {
    expect(statsService.summary().completedThisWeek).toBe(0);
    todosService.complete('todo_a');
    expect(statsService.summary().completedThisWeek).toBe(1);
  });

  it('excludes a todo completed more than a week ago from completedThisWeek', () => {
    // Fixture todo_c is already 'done' with a completedAt far in the past.
    expect(statsService.summary().completedThisWeek).toBe(0);
  });

  it('counts todos per tag', () => {
    const byTag = statsService.byTag();
    expect(byTag.find((t) => t.tagId === 'tag_a')?.todoCount).toBe(2);
    expect(byTag.find((t) => t.tagId === 'tag_b')?.todoCount).toBe(1);
    expect(byTag.find((t) => t.tagId === 'tag_unused')?.todoCount).toBe(0);
  });
});

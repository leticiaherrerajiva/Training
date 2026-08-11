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

  it('counts a todo completed just now as completed this week', () => {
    todosService.complete('todo_a');
    expect(statsService.summary().completedThisWeek).toBe(1);
  });

  it('excludes todos completed more than a week ago', () => {
    // fixture's todo_c has completedAt back in January, well outside the window
    expect(statsService.summary().completedThisWeek).toBe(0);
  });

  it('excludes open todos even with a stale completedAt-less state', () => {
    expect(statsService.summary().open).toBe(2);
    expect(statsService.summary().completedThisWeek).toBe(0);
  });
});

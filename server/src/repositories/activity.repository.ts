import type { ActivityEntry } from '@taskboard/shared';
import { readDb, writeDb } from '../db/store';

/** Persistence for the activity feed. Append-only plus queries. */
export const activityRepository = {
  findAll(): ActivityEntry[] {
    return readDb().activity;
  },

  findByTodoId(todoId: string): ActivityEntry[] {
    return readDb().activity.filter((entry) => entry.todoId === todoId);
  },

  insert(entry: ActivityEntry): ActivityEntry {
    const db = readDb();
    db.activity.push(entry);
    writeDb(db);
    return entry;
  },
};

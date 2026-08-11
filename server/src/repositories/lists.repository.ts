import type { List } from '@taskboard/shared';
import { readDb, writeDb } from '../db/store';

/** Persistence for lists. No business logic — that lives in lists.service.ts. */
export const listsRepository = {
  findAll(): List[] {
    return readDb().lists;
  },

  findById(id: string): List | undefined {
    return readDb().lists.find((l) => l.id === id);
  },

  insert(list: List): List {
    const db = readDb();
    db.lists.push(list);
    writeDb(db);
    return list;
  },

  update(id: string, changes: Partial<List>): List | undefined {
    const db = readDb();
    const list = db.lists.find((l) => l.id === id);
    if (!list) return undefined;
    Object.assign(list, changes);
    writeDb(db);
    return list;
  },

  remove(id: string): boolean {
    const db = readDb();
    const before = db.lists.length;
    db.lists = db.lists.filter((l) => l.id !== id);
    if (db.lists.length === before) return false;
    writeDb(db);
    return true;
  },
};

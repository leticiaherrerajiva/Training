import type { Tag } from '@taskboard/shared';
import { readDb, writeDb } from '../db/store';

/** Persistence for tags. No business logic — that lives in tags.service.ts. */
export const tagsRepository = {
  findAll(): Tag[] {
    return readDb().tags;
  },

  findById(id: string): Tag | undefined {
    return readDb().tags.find((t) => t.id === id);
  },

  insert(tag: Tag): Tag {
    const db = readDb();
    db.tags.push(tag);
    writeDb(db);
    return tag;
  },

  update(id: string, changes: Partial<Tag>): Tag | undefined {
    const db = readDb();
    const tag = db.tags.find((t) => t.id === id);
    if (!tag) return undefined;
    Object.assign(tag, changes);
    writeDb(db);
    return tag;
  },

  remove(id: string): boolean {
    const db = readDb();
    const before = db.tags.length;
    db.tags = db.tags.filter((t) => t.id !== id);
    if (db.tags.length === before) return false;
    writeDb(db);
    return true;
  },
};

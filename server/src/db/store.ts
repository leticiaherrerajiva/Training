import fs from 'node:fs';
import path from 'node:path';
import type { ActivityEntry, List, Tag, Todo } from '@taskboard/shared';
import { config } from '../config';

export interface Db {
  todos: Todo[];
  tags: Tag[];
  lists: List[];
  activity: ActivityEntry[];
}

/**
 * The ONLY module that touches db.json. All access goes through the
 * repositories in src/repositories/ — routes and services must never
 * import this file directly.
 */

function dbPath() {
  return path.join(config.dataDir, 'db.json');
}

function seedPath() {
  return path.join(config.dataDir, 'seed.json');
}

/** Create db.json from seed.json if it does not exist yet. */
export function ensureDb(): void {
  if (!fs.existsSync(dbPath())) {
    fs.copyFileSync(seedPath(), dbPath());
  }
}

export function readDb(): Db {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath(), 'utf8')) as Db;
}

/** Atomic write: write to a temp file, then rename over db.json. */
export function writeDb(db: Db): void {
  const tmp = `${dbPath()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, dbPath());
}

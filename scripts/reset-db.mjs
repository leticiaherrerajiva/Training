#!/usr/bin/env node
// Restores server/data/db.json from the canonical seed (server/data/seed.json).
// Run via `npm run reset-db` whenever you want a clean dataset.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seed = path.join(root, 'server', 'data', 'seed.json');
const db = path.join(root, 'server', 'data', 'db.json');

fs.copyFileSync(seed, db);
console.log(`Reset ${path.relative(root, db)} from ${path.relative(root, seed)}`);

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT ?? 3001),
  /** Directory holding db.json and seed.json. Read lazily so tests can point it at a temp dir. */
  get dataDir(): string {
    return process.env.DATA_DIR ?? path.join(serverRoot, 'data');
  },
  get logLevel(): string {
    return process.env.LOG_LEVEL ?? 'info';
  },
};

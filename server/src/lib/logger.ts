import { config } from '../config';

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function write(level: Level, scope: string, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[(config.logLevel as Level) ?? 'info']) return;
  const line = `${new Date().toISOString()} ${level.toUpperCase().padEnd(5)} [${scope}] ${message}`;
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  if (meta) {
    fn(line, JSON.stringify(meta));
  } else {
    fn(line);
  }
}

/**
 * Project-wide logger. Scope is the file basename, e.g. logger.info('todos.service', 'created', { id }).
 * Server code must use this instead of console.* (enforced by ESLint).
 */
export const logger = {
  debug: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write('debug', scope, message, meta),
  info: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write('info', scope, message, meta),
  warn: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write('warn', scope, message, meta),
  error: (scope: string, message: string, meta?: Record<string, unknown>) =>
    write('error', scope, message, meta),
};

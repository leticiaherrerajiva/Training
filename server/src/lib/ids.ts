import crypto from 'node:crypto';

/** Generate a readable entity id, e.g. newId('todo') -> "todo_9f2c1a7b". */
export function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

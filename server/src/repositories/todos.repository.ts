import type { Todo } from '@taskboard/shared';
import { readDb, writeDb } from '../db/store';

/** Persistence for todos. No business logic — that lives in todos.service.ts. */
export const todosRepository = {
  findAll(): Todo[] {
    return readDb().todos;
  },

  findById(id: string): Todo | undefined {
    return readDb().todos.find((t) => t.id === id);
  },

  insert(todo: Todo): Todo {
    const db = readDb();
    db.todos.push(todo);
    writeDb(db);
    return todo;
  },

  update(id: string, changes: Partial<Todo>): Todo | undefined {
    const db = readDb();
    const todo = db.todos.find((t) => t.id === id);
    if (!todo) return undefined;
    Object.assign(todo, changes);
    writeDb(db);
    return todo;
  },

  remove(id: string): boolean {
    const db = readDb();
    const before = db.todos.length;
    db.todos = db.todos.filter((t) => t.id !== id);
    if (db.todos.length === before) return false;
    writeDb(db);
    return true;
  },
};

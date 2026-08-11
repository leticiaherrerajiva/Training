import type { List } from '@taskboard/shared';
import { ConflictError, NotFoundError } from '../lib/errors';
import { newId } from '../lib/ids';
import { logger } from '../lib/logger';
import { listsRepository } from '../repositories/lists.repository';
import { todosRepository } from '../repositories/todos.repository';

export const listsService = {
  list(): List[] {
    return listsRepository.findAll().toSorted((a, b) => a.name.localeCompare(b.name));
  },

  getById(id: string): List {
    const list = listsRepository.findById(id);
    if (!list) throw new NotFoundError('List', id);
    return list;
  },

  create(input: { name: string; description?: string }): List {
    const list: List = { id: newId('list'), ...input, createdAt: new Date().toISOString() };
    listsRepository.insert(list);
    logger.info('lists.service', 'created list', { id: list.id });
    return list;
  },

  update(id: string, changes: { name?: string; description?: string }): List {
    this.getById(id);
    const updated = listsRepository.update(id, changes)!;
    logger.info('lists.service', 'updated list', { id });
    return updated;
  },

  remove(id: string): void {
    this.getById(id);
    const hasTodos = todosRepository.findAll().some((todo) => todo.listId === id);
    if (hasTodos) throw new ConflictError('List still contains todos; move or delete them first');
    listsRepository.remove(id);
    logger.info('lists.service', 'deleted list', { id });
  },
};

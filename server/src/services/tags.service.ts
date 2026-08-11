import type { Tag } from '@taskboard/shared';
import { ConflictError, NotFoundError } from '../lib/errors';
import { newId } from '../lib/ids';
import { logger } from '../lib/logger';
import { tagsRepository } from '../repositories/tags.repository';
import { todosRepository } from '../repositories/todos.repository';

export const tagsService = {
  list(): Tag[] {
    return tagsRepository.findAll().toSorted((a, b) => a.name.localeCompare(b.name));
  },

  getById(id: string): Tag {
    const tag = tagsRepository.findById(id);
    if (!tag) throw new NotFoundError('Tag', id);
    return tag;
  },

  create(input: { name: string; color: string }): Tag {
    const nameTaken = tagsRepository
      .findAll()
      .some((t) => t.name.toLowerCase() === input.name.toLowerCase());
    if (nameTaken) throw new ConflictError(`A tag named '${input.name}' already exists`);
    const tag: Tag = { id: newId('tag'), ...input, createdAt: new Date().toISOString() };
    tagsRepository.insert(tag);
    logger.info('tags.service', 'created tag', { id: tag.id });
    return tag;
  },

  update(id: string, changes: { name?: string; color?: string }): Tag {
    this.getById(id);
    if (changes.name) {
      const nameTaken = tagsRepository
        .findAll()
        .some((t) => t.id !== id && t.name.toLowerCase() === changes.name!.toLowerCase());
      if (nameTaken) throw new ConflictError(`A tag named '${changes.name}' already exists`);
    }
    const updated = tagsRepository.update(id, changes)!;
    logger.info('tags.service', 'updated tag', { id });
    return updated;
  },

  remove(id: string): void {
    this.getById(id);
    const inUse = todosRepository.findAll().some((todo) => todo.tagIds.includes(id));
    if (inUse)
      throw new ConflictError('Tag is assigned to one or more todos; remove it from them first');
    tagsRepository.remove(id);
    logger.info('tags.service', 'deleted tag', { id });
  },
};

import type { PageMeta, Todo, TodoQuery } from '@taskboard/shared';
import { NotFoundError, ValidationError } from '../lib/errors';
import { newId } from '../lib/ids';
import { logger } from '../lib/logger';
import { listsRepository } from '../repositories/lists.repository';
import { tagsRepository } from '../repositories/tags.repository';
import { todosRepository } from '../repositories/todos.repository';
import { activityService } from './activity.service';

interface CreateTodoInput {
  title: string;
  notes?: string;
  priority: Todo['priority'];
  listId: string;
  tagIds: string[];
  dueDate?: string;
}

interface UpdateTodoInput {
  title?: string;
  notes?: string | null;
  priority?: Todo['priority'];
  listId?: string;
  tagIds?: string[];
  dueDate?: string | null;
}

function assertReferences(input: { listId?: string; tagIds?: string[] }) {
  if (input.listId && !listsRepository.findById(input.listId)) {
    throw new ValidationError(`listId '${input.listId}' does not exist`);
  }
  for (const tagId of input.tagIds ?? []) {
    if (!tagsRepository.findById(tagId)) {
      throw new ValidationError(`tagId '${tagId}' does not exist`);
    }
  }
}

export const todosService = {
  list(query: Required<Pick<TodoQuery, 'sort' | 'page' | 'pageSize'>> & TodoQuery): {
    todos: Todo[];
    meta: PageMeta;
  } {
    let todos = todosRepository.findAll();

    if (query.status) todos = todos.filter((t) => t.status === query.status);
    if (query.priority) todos = todos.filter((t) => t.priority === query.priority);
    if (query.listId) todos = todos.filter((t) => t.listId === query.listId);
    if (query.tagId) todos = todos.filter((t) => t.tagIds.includes(query.tagId!));
    if (query.q) {
      const q = query.q;
      todos = todos.filter((t) => t.title.includes(q) || (t.notes ?? '').includes(q));
    }

    todos = todos.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));

    const start = (query.page - 1) * query.pageSize;
    const pageItems = todos.slice(start, start + query.pageSize);
    return {
      todos: pageItems,
      meta: { total: pageItems.length, page: query.page, pageSize: query.pageSize },
    };
  },

  getById(id: string): Todo {
    const todo = todosRepository.findById(id);
    if (!todo) throw new NotFoundError('Todo', id);
    return todo;
  },

  create(input: CreateTodoInput): Todo {
    assertReferences(input);
    const now = new Date().toISOString();
    const todo: Todo = {
      id: newId('todo'),
      title: input.title,
      notes: input.notes,
      status: 'open',
      priority: input.priority,
      listId: input.listId,
      tagIds: input.tagIds,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    todosRepository.insert(todo);
    activityService.record(todo, 'created');
    logger.info('todos.service', 'created todo', { id: todo.id });
    return todo;
  },

  update(id: string, input: UpdateTodoInput): Todo {
    this.getById(id);
    assertReferences({ listId: input.listId, tagIds: input.tagIds });
    const changes: Partial<Todo> = {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.notes !== undefined && { notes: input.notes ?? undefined }),
      ...(input.priority !== undefined && { priority: input.priority }),
      ...(input.listId !== undefined && { listId: input.listId }),
      ...(input.tagIds !== undefined && { tagIds: input.tagIds }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate ?? undefined }),
      updatedAt: new Date().toISOString(),
    };
    const updated = todosRepository.update(id, changes)!;
    activityService.record(updated, 'updated');
    logger.info('todos.service', 'updated todo', { id });
    return updated;
  },

  complete(id: string): Todo {
    const todo = this.getById(id);
    if (todo.status === 'done') return todo;
    const now = new Date().toISOString();
    const updated = todosRepository.update(id, {
      status: 'done',
      completedAt: now,
      updatedAt: now,
    })!;
    activityService.record(updated, 'completed');
    logger.info('todos.service', 'completed todo', { id });
    return updated;
  },

  reopen(id: string): Todo {
    const todo = this.getById(id);
    if (todo.status === 'open') return todo;
    const updated = todosRepository.update(id, {
      status: 'open',
      completedAt: undefined,
      updatedAt: new Date().toISOString(),
    })!;
    activityService.record(updated, 'reopened');
    logger.info('todos.service', 'reopened todo', { id });
    return updated;
  },

  remove(id: string): void {
    const todo = this.getById(id);
    todosRepository.remove(id);
    activityService.record(todo, 'deleted');
    logger.info('todos.service', 'deleted todo', { id });
  },
};

import type { StatsSummary, TagStat } from '@taskboard/shared';
import { tagsRepository } from '../repositories/tags.repository';
import { todosRepository } from '../repositories/todos.repository';

function isoDateToday(): string {
  return new Date().toISOString().slice(0, 10);
}

const COMPLETED_STATUS: string = 'completed';

export const statsService = {
  summary(): StatsSummary {
    const todos = todosRepository.findAll();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today = isoDateToday();

    return {
      total: todos.length,
      open: todos.filter((t) => t.status === 'open').length,
      done: todos.filter((t) => t.status === 'done').length,
      byPriority: {
        low: todos.filter((t) => t.priority === 'low').length,
        medium: todos.filter((t) => t.priority === 'medium').length,
        high: todos.filter((t) => t.priority === 'high').length,
      },
      completedThisWeek: todos.filter(
        (t) => t.status === COMPLETED_STATUS && t.completedAt && t.completedAt >= weekAgo,
      ).length,
      overdue: todos.filter((t) => t.status === 'open' && t.dueDate && t.dueDate < today).length,
    };
  },

  byTag(): TagStat[] {
    const todos = todosRepository.findAll();
    return tagsRepository.findAll().map((tag) => ({
      tagId: tag.id,
      tagName: tag.name,
      color: tag.color,
      todoCount: todos.filter((t) => t.tagIds.includes(tag.id)).length,
    }));
  },
};

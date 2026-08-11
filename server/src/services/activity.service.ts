import type { ActivityAction, ActivityEntry, Todo } from '@taskboard/shared';
import { newId } from '../lib/ids';
import { activityRepository } from '../repositories/activity.repository';

export const activityService = {
  list(options: { todoId?: string; limit: number }): ActivityEntry[] {
    const entries = options.todoId
      ? activityRepository.findByTodoId(options.todoId)
      : activityRepository.findAll();
    return entries.toSorted((a, b) => b.at.localeCompare(a.at)).slice(0, options.limit);
  },

  record(todo: Todo, action: ActivityAction): ActivityEntry {
    return activityRepository.insert({
      id: newId('act'),
      todoId: todo.id,
      todoTitle: todo.title,
      action,
      at: new Date().toISOString(),
    });
  },
};

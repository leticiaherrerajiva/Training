import type { ActivityEntry } from '@taskboard/shared';
import { request } from './http';

export const activityApi = {
  async list(options: { todoId?: string; limit?: number } = {}): Promise<ActivityEntry[]> {
    const params = new URLSearchParams();
    if (options.todoId) params.set('todoId', options.todoId);
    if (options.limit) params.set('limit', String(options.limit));
    const qs = params.toString();
    return (await request<ActivityEntry[]>(`/api/activity${qs ? `?${qs}` : ''}`)).data;
  },
};

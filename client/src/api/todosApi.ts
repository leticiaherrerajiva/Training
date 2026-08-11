import type { PageMeta, Todo, TodoQuery } from '@taskboard/shared';
import { request } from './http';

export interface CreateTodoInput {
  title: string;
  notes?: string;
  priority?: Todo['priority'];
  listId: string;
  tagIds?: string[];
  dueDate?: string;
}

export type UpdateTodoInput = Partial<CreateTodoInput>;

function toQueryString(query: TodoQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const todosApi = {
  list(query: TodoQuery = {}): Promise<{ data: Todo[]; meta?: PageMeta }> {
    return request<Todo[]>(`/api/todos${toQueryString(query)}`);
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    return (await request<Todo>('/api/todos', { method: 'POST', body: input })).data;
  },

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    return (await request<Todo>(`/api/todos/${id}`, { method: 'PATCH', body: input })).data;
  },

  async complete(id: string): Promise<Todo> {
    return (await request<Todo>(`/api/todos/${id}/complete`, { method: 'POST' })).data;
  },

  async reopen(id: string): Promise<Todo> {
    return (await request<Todo>(`/api/todos/${id}/reopen`, { method: 'POST' })).data;
  },

  async remove(id: string): Promise<void> {
    await request(`/api/todos/${id}`, { method: 'DELETE' });
  },
};

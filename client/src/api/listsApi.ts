import type { List } from '@taskboard/shared';
import { request } from './http';

export interface CreateListInput {
  name: string;
  description?: string;
}

export type UpdateListInput = Partial<CreateListInput>;

export const listsApi = {
  async list(): Promise<List[]> {
    return (await request<List[]>('/api/lists')).data;
  },

  async create(input: CreateListInput): Promise<List> {
    return (await request<List>('/api/lists', { method: 'POST', body: input })).data;
  },

  async update(id: string, input: UpdateListInput): Promise<List> {
    return (await request<List>(`/api/lists/${id}`, { method: 'PATCH', body: input })).data;
  },

  async remove(id: string): Promise<void> {
    await request(`/api/lists/${id}`, { method: 'DELETE' });
  },
};

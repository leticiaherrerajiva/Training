import type { Tag } from '@taskboard/shared';
import { request } from './http';

export interface CreateTagInput {
  name: string;
  color: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;

export const tagsApi = {
  async list(): Promise<Tag[]> {
    return (await request<Tag[]>('/api/tags')).data;
  },

  async create(input: CreateTagInput): Promise<Tag> {
    return (await request<Tag>('/api/tags', { method: 'POST', body: input })).data;
  },

  async update(id: string, input: UpdateTagInput): Promise<Tag> {
    return (await request<Tag>(`/api/tags/${id}`, { method: 'PATCH', body: input })).data;
  },

  async remove(id: string): Promise<void> {
    await request(`/api/tags/${id}`, { method: 'DELETE' });
  },
};

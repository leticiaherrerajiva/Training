import type { InspirationQuote } from '@taskboard/shared';
import { request } from './http';

export const inspirationApi = {
  async getQuote(category: string): Promise<InspirationQuote> {
    return (await request<InspirationQuote>(`/api/inspiration?category=${category}`)).data;
  },
};

import type { StatsSummary, TagStat } from '@taskboard/shared';
import { request } from './http';

export const statsApi = {
  async summary(): Promise<StatsSummary> {
    return (await request<StatsSummary>('/api/stats/summary')).data;
  },

  async byTag(): Promise<TagStat[]> {
    return (await request<TagStat[]>('/api/stats/tags')).data;
  },
};

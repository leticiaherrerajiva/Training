import { useCallback, useEffect, useState } from 'react';
import type { StatsSummary, TagStat } from '@taskboard/shared';
import { statsApi } from '../api/statsApi';

export function useStats() {
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [tagStats, setTagStats] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, tagData] = await Promise.all([statsApi.summary(), statsApi.byTag()]);
      setSummary(summaryData);
      setTagStats(tagData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { summary, tagStats, loading, error, refetch };
}

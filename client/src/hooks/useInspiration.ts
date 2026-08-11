import { useCallback, useEffect, useState } from 'react';
import type { InspirationQuote } from '@taskboard/shared';
import { inspirationApi } from '../api/inspirationApi';

export function useInspiration(category: string) {
  const [quote, setQuote] = useState<InspirationQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setQuote(await inspirationApi.getQuote(category));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quote');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { quote, loading, error, refetch };
}

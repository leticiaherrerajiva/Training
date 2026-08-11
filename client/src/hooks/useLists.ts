import { useCallback, useEffect, useState } from 'react';
import type { List } from '@taskboard/shared';
import { listsApi, type CreateListInput, type UpdateListInput } from '../api/listsApi';

export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLists(await listsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createList = useCallback(
    async (input: CreateListInput) => {
      await listsApi.create(input);
      await refetch();
    },
    [refetch],
  );

  const updateList = useCallback(
    async (id: string, input: UpdateListInput) => {
      await listsApi.update(id, input);
      await refetch();
    },
    [refetch],
  );

  const deleteList = useCallback(
    async (id: string) => {
      await listsApi.remove(id);
      await refetch();
    },
    [refetch],
  );

  return { lists, loading, error, refetch, createList, updateList, deleteList };
}

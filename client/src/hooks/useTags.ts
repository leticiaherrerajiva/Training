import { useCallback, useEffect, useState } from 'react';
import type { Tag } from '@taskboard/shared';
import { tagsApi, type CreateTagInput, type UpdateTagInput } from '../api/tagsApi';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTags(await tagsApi.list());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createTag = useCallback(
    async (input: CreateTagInput) => {
      await tagsApi.create(input);
      await refetch();
    },
    [refetch],
  );

  const updateTag = useCallback(
    async (id: string, input: UpdateTagInput) => {
      await tagsApi.update(id, input);
      await refetch();
    },
    [refetch],
  );

  const deleteTag = useCallback(
    async (id: string) => {
      await tagsApi.remove(id);
      await refetch();
    },
    [refetch],
  );

  return { tags, loading, error, refetch, createTag, updateTag, deleteTag };
}

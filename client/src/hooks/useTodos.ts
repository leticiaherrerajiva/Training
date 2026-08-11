import { useCallback, useEffect, useState } from 'react';
import type { PageMeta, Todo, TodoQuery } from '@taskboard/shared';
import { todosApi, type CreateTodoInput, type UpdateTodoInput } from '../api/todosApi';

export function useTodos(query: TodoQuery) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [meta, setMeta] = useState<PageMeta | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize so the effect only re-runs when the query actually changes.
  const queryKey = JSON.stringify(query);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await todosApi.list(JSON.parse(queryKey) as TodoQuery);
      setTodos(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createTodo = useCallback(
    async (input: CreateTodoInput) => {
      await todosApi.create(input);
      await refetch();
    },
    [refetch],
  );

  const updateTodo = useCallback(
    async (id: string, input: UpdateTodoInput) => {
      await todosApi.update(id, input);
      await refetch();
    },
    [refetch],
  );

  const completeTodo = useCallback(
    async (id: string) => {
      await todosApi.complete(id);
      await refetch();
    },
    [refetch],
  );

  const reopenTodo = useCallback(
    async (id: string) => {
      await todosApi.reopen(id);
      await refetch();
    },
    [refetch],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      await todosApi.remove(id);
      await refetch();
    },
    [refetch],
  );

  return {
    todos,
    meta,
    loading,
    error,
    refetch,
    createTodo,
    updateTodo,
    completeTodo,
    reopenTodo,
    deleteTodo,
  };
}

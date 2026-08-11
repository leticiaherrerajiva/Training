import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Todo } from '@taskboard/shared';
import { useTodos } from './useTodos';
import { todosApi } from '../api/todosApi';

vi.mock('../api/todosApi', () => ({
  todosApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    complete: vi.fn(),
    reopen: vi.fn(),
    remove: vi.fn(),
    clearCompleted: vi.fn(),
  },
}));

const TODOS: Todo[] = [
  {
    id: 'todo_a',
    title: 'First',
    status: 'open',
    priority: 'medium',
    listId: 'list_a',
    tagIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(todosApi.list).mockResolvedValue({ data: TODOS, meta: { total: 1, page: 1, pageSize: 20 } });
  });

  it('loads todos on mount', async () => {
    const { result } = renderHook(() => useTodos({}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toEqual(TODOS);
  });

  it('clears completed todos then refetches', async () => {
    vi.mocked(todosApi.clearCompleted).mockResolvedValue({ deletedCount: 2 });
    const { result } = renderHook(() => useTodos({}));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const outcome = await act(() => result.current.clearCompletedTodos('list_a'));

    expect(todosApi.clearCompleted).toHaveBeenCalledWith('list_a');
    expect(todosApi.list).toHaveBeenCalledTimes(2);
    expect(outcome).toEqual({ deletedCount: 2 });
  });
});

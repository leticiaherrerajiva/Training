import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { TodoPriority, TodoStatus } from '@taskboard/shared';

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  tagId?: string;
  listId?: string;
  q?: string;
  page: number;
}

interface TodoFiltersContextValue {
  filters: TodoFilters;
  setFilter: <K extends keyof TodoFilters>(key: K, value: TodoFilters[K]) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: TodoFilters = { page: 1 };

const TodoFiltersContext = createContext<TodoFiltersContextValue | null>(null);

export interface TodoFiltersProviderProps {
  children: ReactNode;
}

/** Shares the todo filter state between TodoFilterBar and TodoGrid. */
export function TodoFiltersProvider({ children }: TodoFiltersProviderProps) {
  const [filters, setFilters] = useState<TodoFilters>(DEFAULT_FILTERS);

  const value = useMemo<TodoFiltersContextValue>(
    () => ({
      filters,
      setFilter(key, value) {
        // Any filter change returns to page 1 so results stay visible.
        setFilters((prev) => ({ ...prev, [key]: value, ...(key !== 'page' && { page: 1 }) }));
      },
      resetFilters() {
        setFilters(DEFAULT_FILTERS);
      },
    }),
    [filters],
  );

  return <TodoFiltersContext.Provider value={value}>{children}</TodoFiltersContext.Provider>;
}

export function useTodoFilters(): TodoFiltersContextValue {
  const ctx = useContext(TodoFiltersContext);
  if (!ctx) throw new Error('useTodoFilters must be used inside TodoFiltersProvider');
  return ctx;
}

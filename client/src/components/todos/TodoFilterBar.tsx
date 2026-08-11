import type { List, PageMeta, Tag, TodoPriority, TodoStatus } from '@taskboard/shared';
import { useTodoFilters } from '../../context/TodoFiltersContext';
import { Button } from '../ui/Button';
import styles from './TodoFilterBar.module.css';

export interface TodoFilterBarProps {
  lists: List[];
  tags: Tag[];
  meta?: PageMeta;
}

export function TodoFilterBar({ lists, tags, meta }: TodoFilterBarProps) {
  const { filters, setFilter, resetFilters } = useTodoFilters();

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : 1;

  return (
    <div className={styles.bar}>
      <input
        className={styles.search}
        placeholder="Search title and notes…"
        value={filters.q ?? ''}
        onChange={(e) => setFilter('q', e.target.value === '' ? undefined : e.target.value)}
      />
      <select
        value={filters.status ?? ''}
        onChange={(e) =>
          setFilter('status', e.target.value === '' ? undefined : (e.target.value as TodoStatus))
        }
      >
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="done">Done</option>
      </select>
      <select
        value={filters.priority ?? ''}
        onChange={(e) =>
          setFilter(
            'priority',
            e.target.value === '' ? undefined : (e.target.value as TodoPriority),
          )
        }
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={filters.listId ?? ''}
        onChange={(e) => setFilter('listId', e.target.value === '' ? undefined : e.target.value)}
      >
        <option value="">All lists</option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <select
        value={filters.tagId ?? ''}
        onChange={(e) => setFilter('tagId', e.target.value === '' ? undefined : e.target.value)}
      >
        <option value="">All tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
      <Button onClick={resetFilters}>Clear</Button>
      <div className={styles.pager}>
        <Button disabled={filters.page <= 1} onClick={() => setFilter('page', filters.page - 1)}>
          ‹
        </Button>
        <span className={styles.pageInfo}>
          Page {filters.page} of {totalPages} ({meta?.total ?? 0} todos)
        </span>
        <Button
          disabled={filters.page >= totalPages}
          onClick={() => setFilter('page', filters.page + 1)}
        >
          ›
        </Button>
      </div>
    </div>
  );
}

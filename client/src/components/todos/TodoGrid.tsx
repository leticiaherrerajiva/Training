import type { Tag, Todo } from '@taskboard/shared';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { TodoCard } from './TodoCard';
import styles from './TodoGrid.module.css';

export interface TodoGridProps {
  todos: Todo[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onComplete: (id: string) => Promise<void>;
  onReopen: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoGrid({
  todos,
  tags,
  loading,
  error,
  onRetry,
  onComplete,
  onReopen,
  onDelete,
}: TodoGridProps) {
  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <EmptyState title="No todos match" hint="Try clearing the filters, or create a new todo." />
    );
  }

  return (
    <div className={styles.grid}>
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          tags={tags}
          onComplete={onComplete}
          onReopen={onReopen}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

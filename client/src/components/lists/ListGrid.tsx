import type { List } from '@taskboard/shared';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { ListCard } from './ListCard';
import styles from './ListGrid.module.css';

export interface ListGridProps {
  lists: List[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function ListGrid({ lists, loading, error, onRetry, onDelete }: ListGridProps) {
  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (lists.length === 0) {
    return <EmptyState title="No lists yet" hint="Create a list to organize your todos." />;
  }

  return (
    <div className={styles.grid}>
      {lists.map((list) => (
        <ListCard key={list.id} list={list} onDelete={onDelete} />
      ))}
    </div>
  );
}

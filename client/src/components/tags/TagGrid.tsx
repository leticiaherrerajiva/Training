import type { Tag } from '@taskboard/shared';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { TagCard } from './TagCard';
import styles from './TagGrid.module.css';

export interface TagGridProps {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function TagGrid({ tags, loading, error, onRetry, onDelete }: TagGridProps) {
  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className={styles.error} role="alert">
        <p>{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    );
  }

  if (tags.length === 0) {
    return <EmptyState title="No tags yet" hint="Create a tag to start labeling todos." />;
  }

  return (
    <div className={styles.grid}>
      {tags.map((tag) => (
        <TagCard key={tag.id} tag={tag} onDelete={onDelete} />
      ))}
    </div>
  );
}

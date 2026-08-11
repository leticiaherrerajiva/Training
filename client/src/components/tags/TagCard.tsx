import { useState } from 'react';
import type { Tag } from '@taskboard/shared';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import styles from './TagCard.module.css';

export interface TagCardProps {
  tag: Tag;
  onDelete: (id: string) => Promise<void>;
}

export function TagCard({ tag, onDelete }: TagCardProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);
    try {
      await onDelete(tag.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <Badge tone="neutral" dotColor={tag.color}>
          {tag.name}
        </Badge>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
      {deleteError && (
        <p className={styles.deleteError} role="alert">
          {deleteError}
        </p>
      )}
    </div>
  );
}

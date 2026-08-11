import { useState } from 'react';
import type { List } from '@taskboard/shared';
import { Button } from '../ui/Button';
import styles from './ListCard.module.css';

export interface ListCardProps {
  list: List;
  onDelete: (id: string) => Promise<void>;
}

export function ListCard({ list, onDelete }: ListCardProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleteError(null);
    try {
      await onDelete(list.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div>
          <h3 className={styles.name}>{list.name}</h3>
          {list.description && <p className={styles.description}>{list.description}</p>}
        </div>
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

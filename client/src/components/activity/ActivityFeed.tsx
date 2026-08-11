import { useEffect, useState } from 'react';
import type { ActivityEntry } from '@taskboard/shared';
import { activityApi } from '../../api/activityApi';
import styles from './ActivityFeed.module.css';

const ACTION_LABELS: Record<ActivityEntry['action'], string> = {
  created: 'created',
  updated: 'updated',
  completed: 'completed',
  reopened: 'reopened',
  deleted: 'deleted',
};

export interface ActivityFeedProps {
  /** Re-fetch whenever this value changes (e.g. the todos array after a mutation). */
  refreshKey: unknown;
}

export function ActivityFeed({ refreshKey }: ActivityFeedProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    activityApi
      .list({ limit: 12 })
      .then(setEntries)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load activity'),
      );
  }, [refreshKey]);

  return (
    <aside className={styles.feed}>
      <h2 className={styles.heading}>Recent activity</h2>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.items}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <span className={`${styles.action} ${styles[entry.action]}`}>
              {ACTION_LABELS[entry.action]}
            </span>
            <span className={styles.title}>{entry.todoTitle}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import type { TagStat } from '@taskboard/shared';
import { Badge } from '../ui/Badge';
import styles from './TagBreakdown.module.css';

export interface TagBreakdownProps {
  stats: TagStat[];
}

export function TagBreakdown({ stats }: TagBreakdownProps) {
  const max = Math.max(1, ...stats.map((s) => s.todoCount));

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Todos per tag</h2>
      <ul className={styles.rows}>
        {stats.map((stat) => (
          <li key={stat.tagId} className={styles.row}>
            <Badge tone="neutral" dotColor={stat.color}>
              {stat.tagName}
            </Badge>
            <div className={styles.track}>
              <div
                className={styles.bar}
                style={{ width: `${(stat.todoCount / max) * 100}%`, backgroundColor: stat.color }}
              />
            </div>
            <span className={styles.count}>{stat.todoCount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

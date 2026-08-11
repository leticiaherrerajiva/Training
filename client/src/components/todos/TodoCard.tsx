import { useState } from 'react';
import type { Tag, Todo } from '@taskboard/shared';
import { formatDate, isOverdue } from '../../lib/dates';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import styles from './TodoCard.module.css';

export interface TodoCardProps {
  todo: Todo;
  tags: Tag[];
  onComplete: (id: string) => Promise<void>;
  onReopen: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoCard({ todo, tags, onComplete, onReopen, onDelete }: TodoCardProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const todoTags = tags.filter((tag) => todo.tagIds.includes(tag.id));
  const overdue = todo.status === 'open' && isOverdue(todo.dueDate);

  async function run(action: (id: string) => Promise<void>) {
    setActionError(null);
    try {
      await action(todo.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    }
  }

  return (
    <div className={todo.status === 'done' ? `${styles.card} ${styles.done}` : styles.card}>
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{todo.title}</span>
          <Badge tone={todo.priority}>{todo.priority}</Badge>
          {overdue && <Badge tone="high">Overdue</Badge>}
        </div>
        {todo.notes && <p className={styles.notes}>{todo.notes}</p>}
        <div className={styles.metaRow}>
          {todo.dueDate && <span className={styles.due}>Due {formatDate(todo.dueDate)}</span>}
          {todoTags.map((tag) => (
            <Badge key={tag.id} tone="neutral" dotColor={tag.color}>
              {tag.name}
            </Badge>
          ))}
        </div>
        {actionError && (
          <p className={styles.actionError} role="alert">
            {actionError}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        {todo.status === 'open' ? (
          <Button variant="primary" onClick={() => run(onComplete)}>
            Done
          </Button>
        ) : (
          <Button onClick={() => run(onReopen)}>Reopen</Button>
        )}
        <Button variant="danger" onClick={() => run(onDelete)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

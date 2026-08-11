import { useState } from 'react';
import type { List, Tag, TodoPriority } from '@taskboard/shared';
import type { CreateTodoInput } from '../../api/todosApi';
import { Button } from '../ui/Button';
import styles from './TodoForm.module.css';

export interface TodoFormProps {
  lists: List[];
  tags: Tag[];
  onSubmit: (input: CreateTodoInput) => Promise<void>;
  onCancel: () => void;
}

export function TodoForm({ lists, tags, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [listId, setListId] = useState(lists[0]?.id ?? '');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        notes: notes.trim() === '' ? undefined : notes.trim(),
        priority,
        listId,
        tagIds,
        dueDate: dueDate === '' ? undefined : dueDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todo');
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          required
          maxLength={120}
        />
      </label>
      <label className={styles.field}>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Optional details"
        />
      </label>
      <div className={styles.row}>
        <label className={styles.field}>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value as TodoPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className={styles.field}>
          List
          <select value={listId} onChange={(e) => setListId(e.target.value)} required>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Due date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
      </div>
      <fieldset className={styles.tags}>
        <legend>Tags</legend>
        {tags.map((tag) => (
          <label key={tag.id} className={styles.tagOption}>
            <input
              type="checkbox"
              checked={tagIds.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </fieldset>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          type="submit"
          disabled={submitting || title.trim() === '' || listId === ''}
        >
          {submitting ? 'Saving…' : 'Save todo'}
        </Button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import type { CreateTagInput } from '../../api/tagsApi';
import { Button } from '../ui/Button';
import styles from './TagForm.module.css';

export interface TagFormProps {
  onSubmit: (input: CreateTagInput) => Promise<void>;
  onCancel: () => void;
}

export function TagForm({ onSubmit, onCancel }: TagFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4c9aff');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), color });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tag');
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. frontend"
          required
          maxLength={30}
        />
      </label>
      <label className={styles.field}>
        Color
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={submitting || name.trim() === ''}>
          {submitting ? 'Saving…' : 'Save tag'}
        </Button>
      </div>
    </form>
  );
}

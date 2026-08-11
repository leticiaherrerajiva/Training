import { useState } from 'react';
import type { CreateListInput } from '../../api/listsApi';
import { Button } from '../ui/Button';
import styles from './ListForm.module.css';

export interface ListFormProps {
  onSubmit: (input: CreateListInput) => Promise<void>;
  onCancel: () => void;
}

export function ListForm({ onSubmit, onCancel }: ListFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() === '' ? undefined : description.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save list');
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
          placeholder="e.g. Sprint Work"
          required
          maxLength={50}
        />
      </label>
      <label className={styles.field}>
        Description
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional"
          maxLength={200}
        />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.actions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={submitting || name.trim() === ''}>
          {submitting ? 'Saving…' : 'Save list'}
        </Button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { useInspiration } from '../../hooks/useInspiration';
import { Button } from '../ui/Button';
import styles from './InspirationWidget.module.css';

const CATEGORIES = ['grit', 'focus', 'teamwork'];

/**
 * Worked example of consuming a flaky external API: the quote provider
 * intermittently rate-limits and errors, so this widget always renders an
 * inline error state with a retry action instead of breaking the page.
 */
export function InspirationWidget() {
  const [category, setCategory] = useState('grit');
  const { quote, loading, error, refetch } = useInspiration(category);

  return (
    <div className={styles.widget}>
      {loading && <span className={styles.loading}>Fetching inspiration…</span>}
      {!loading && error && (
        <span className={styles.error} role="alert">
          {error} <Button onClick={refetch}>Retry</Button>
        </span>
      )}
      {!loading && !error && quote && (
        <blockquote className={styles.quote}>
          “{quote.text}” <cite>— {quote.author}</cite>
        </blockquote>
      )}
      <select
        className={styles.category}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Quote category"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

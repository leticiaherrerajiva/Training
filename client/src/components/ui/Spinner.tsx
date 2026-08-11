import styles from './Spinner.module.css';

export function Spinner() {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading">
      <div className={styles.spinner} />
    </div>
  );
}

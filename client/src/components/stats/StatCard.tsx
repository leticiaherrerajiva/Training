import styles from './StatCard.module.css';

export interface StatCardProps {
  label: string;
  value: number;
  tone?: 'high';
}

export function StatCard({ label, value, tone }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span
        className={tone === 'high' && value > 0 ? `${styles.value} ${styles.high}` : styles.value}
      >
        {value}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

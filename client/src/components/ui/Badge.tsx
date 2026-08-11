import styles from './Badge.module.css';

export interface BadgeProps {
  tone: 'low' | 'medium' | 'high' | 'neutral';
  children: React.ReactNode;
  /** Optional swatch color rendered as a small dot before the label. */
  dotColor?: string;
}

export function Badge({ tone, children, dotColor }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {dotColor && <span className={styles.dot} style={{ backgroundColor: dotColor }} />}
      {children}
    </span>
  );
}

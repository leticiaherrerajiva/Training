import { useStats } from '../../hooks/useStats';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { PageHeader } from '../layout/PageHeader';
import { StatCard } from './StatCard';
import { TagBreakdown } from './TagBreakdown';
import styles from './StatsPage.module.css';

export function StatsPage() {
  const { summary, tagStats, loading, error, refetch } = useStats();

  return (
    <section>
      <PageHeader title="Stats" subtitle="How the board is doing at a glance" />
      {loading && <Spinner />}
      {!loading && error && (
        <div className={styles.error} role="alert">
          <p>{error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      )}
      {!loading && !error && summary && (
        <>
          <div className={styles.cards}>
            <StatCard label="Total todos" value={summary.total} />
            <StatCard label="Open" value={summary.open} />
            <StatCard label="Done" value={summary.done} />
            <StatCard label="Completed this week" value={summary.completedThisWeek} />
            <StatCard label="Overdue" value={summary.overdue} tone="high" />
            <StatCard label="High priority" value={summary.byPriority.high} tone="high" />
          </div>
          <TagBreakdown stats={tagStats} />
        </>
      )}
    </section>
  );
}

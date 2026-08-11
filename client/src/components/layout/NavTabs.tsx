import styles from './NavTabs.module.css';

export type TabKey = 'todos' | 'lists' | 'tags' | 'stats';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'lists', label: 'Lists' },
  { key: 'tags', label: 'Tags' },
  { key: 'stats', label: 'Stats' },
];

export interface NavTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function NavTabs({ active, onChange }: NavTabsProps) {
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={tab.key === active ? `${styles.tab} ${styles.active}` : styles.tab}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

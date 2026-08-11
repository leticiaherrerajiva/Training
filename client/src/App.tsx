import { useState } from 'react';
import { NavTabs, type TabKey } from './components/layout/NavTabs';
import { ListsPage } from './components/lists/ListsPage';
import { StatsPage } from './components/stats/StatsPage';
import { TagsPage } from './components/tags/TagsPage';
import { TodosPage } from './components/todos/TodosPage';
import styles from './App.module.css';

export function App() {
  const [tab, setTab] = useState<TabKey>('todos');

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>TaskBoard</span>
        <span className={styles.tagline}>FSL AI-workflows training app</span>
      </header>
      <NavTabs active={tab} onChange={setTab} />
      <main className={styles.main}>
        {tab === 'todos' && <TodosPage />}
        {tab === 'lists' && <ListsPage />}
        {tab === 'tags' && <TagsPage />}
        {tab === 'stats' && <StatsPage />}
      </main>
    </div>
  );
}

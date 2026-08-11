import { useState } from 'react';
import { useLists } from '../../hooks/useLists';
import { useTags } from '../../hooks/useTags';
import { useTodos } from '../../hooks/useTodos';
import { TodoFiltersProvider, useTodoFilters } from '../../context/TodoFiltersContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { PageHeader } from '../layout/PageHeader';
import { ActivityFeed } from '../activity/ActivityFeed';
import { InspirationWidget } from '../inspiration/InspirationWidget';
import { TodoFilterBar } from './TodoFilterBar';
import { TodoForm } from './TodoForm';
import { TodoGrid } from './TodoGrid';
import styles from './TodosPage.module.css';

export function TodosPage() {
  return (
    <TodoFiltersProvider>
      <TodosPageContent />
    </TodoFiltersProvider>
  );
}

function TodosPageContent() {
  const { filters } = useTodoFilters();
  const { lists } = useLists();
  const { tags } = useTags();
  const { todos, meta, loading, error, refetch, createTodo, completeTodo, reopenTodo, deleteTodo } =
    useTodos(filters);
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <PageHeader
        title="Todos"
        subtitle="Everything on the board, filterable by list, tag, and status"
        actions={
          <Button variant="primary" onClick={() => setShowForm(true)}>
            New todo
          </Button>
        }
      />
      <InspirationWidget />
      <TodoFilterBar lists={lists} tags={tags} meta={meta} />
      <div className={styles.layout}>
        <TodoGrid
          todos={todos}
          tags={tags}
          loading={loading}
          error={error}
          onRetry={refetch}
          onComplete={completeTodo}
          onReopen={reopenTodo}
          onDelete={deleteTodo}
        />
        <ActivityFeed refreshKey={todos} />
      </div>
      {showForm && (
        <Modal title="New todo" onClose={() => setShowForm(false)}>
          <TodoForm
            lists={lists}
            tags={tags}
            onSubmit={async (input) => {
              await createTodo(input);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </section>
  );
}

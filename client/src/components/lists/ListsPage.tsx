import { useState } from 'react';
import { useLists } from '../../hooks/useLists';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { PageHeader } from '../layout/PageHeader';
import { ListForm } from './ListForm';
import { ListGrid } from './ListGrid';

export function ListsPage() {
  const { lists, loading, error, refetch, createList, deleteList } = useLists();
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <PageHeader
        title="Lists"
        subtitle="Group todos by project or area"
        actions={
          <Button variant="primary" onClick={() => setShowForm(true)}>
            New list
          </Button>
        }
      />
      <ListGrid
        lists={lists}
        loading={loading}
        error={error}
        onRetry={refetch}
        onDelete={deleteList}
      />
      {showForm && (
        <Modal title="New list" onClose={() => setShowForm(false)}>
          <ListForm
            onSubmit={async (input) => {
              await createList(input);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </section>
  );
}

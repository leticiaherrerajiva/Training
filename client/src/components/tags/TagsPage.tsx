import { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { PageHeader } from '../layout/PageHeader';
import { TagForm } from './TagForm';
import { TagGrid } from './TagGrid';

export function TagsPage() {
  const { tags, loading, error, refetch, createTag, deleteTag } = useTags();
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <PageHeader
        title="Tags"
        subtitle="Label todos so they can be filtered and reported on"
        actions={
          <Button variant="primary" onClick={() => setShowForm(true)}>
            New tag
          </Button>
        }
      />
      <TagGrid tags={tags} loading={loading} error={error} onRetry={refetch} onDelete={deleteTag} />
      {showForm && (
        <Modal title="New tag" onClose={() => setShowForm(false)}>
          <TagForm
            onSubmit={async (input) => {
              await createTag(input);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </section>
  );
}

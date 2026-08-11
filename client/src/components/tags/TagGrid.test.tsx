import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Tag } from '@taskboard/shared';
import { TagGrid } from './TagGrid';

const TAGS: Tag[] = [
  { id: 'tag_a', name: 'alpha', color: '#111111', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'tag_b', name: 'beta', color: '#222222', createdAt: '2026-01-02T00:00:00.000Z' },
];

const noop = async () => {};

describe('TagGrid', () => {
  it('renders a card per tag', () => {
    render(<TagGrid tags={TAGS} loading={false} error={null} onRetry={() => {}} onDelete={noop} />);
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  it('shows a spinner while loading', () => {
    render(<TagGrid tags={[]} loading={true} error={null} onRetry={() => {}} onDelete={noop} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error with a retry button', async () => {
    const onRetry = vi.fn();
    render(<TagGrid tags={[]} loading={false} error="Boom" onRetry={onRetry} onDelete={noop} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows an empty state when there are no tags', () => {
    render(<TagGrid tags={[]} loading={false} error={null} onRetry={() => {}} onDelete={noop} />);
    expect(screen.getByText('No tags yet')).toBeInTheDocument();
  });
});

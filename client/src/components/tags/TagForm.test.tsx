import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagForm } from './TagForm';

describe('TagForm', () => {
  it('submits the trimmed name and chosen color', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TagForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText('Name'), '  infra  ');
    await userEvent.click(screen.getByRole('button', { name: 'Save tag' }));

    expect(onSubmit).toHaveBeenCalledWith({ name: 'infra', color: '#4c9aff' });
  });

  it('disables submit while the name is empty', () => {
    render(<TagForm onSubmit={vi.fn()} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: 'Save tag' })).toBeDisabled();
  });

  it('surfaces submission errors from the API', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("A tag named 'infra' already exists"));
    render(<TagForm onSubmit={onSubmit} onCancel={() => {}} />);

    await userEvent.type(screen.getByLabelText('Name'), 'infra');
    await userEvent.click(screen.getByRole('button', { name: 'Save tag' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('already exists');
  });

  it('calls onCancel when cancel is clicked', async () => {
    const onCancel = vi.fn();
    render(<TagForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

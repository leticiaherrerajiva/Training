import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTags } from './useTags';
import { tagsApi } from '../api/tagsApi';

vi.mock('../api/tagsApi', () => ({
  tagsApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

const TAGS = [{ id: 'tag_a', name: 'alpha', color: '#111111', createdAt: '' }];

describe('useTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tagsApi.list).mockResolvedValue(TAGS);
  });

  it('loads tags on mount', async () => {
    const { result } = renderHook(() => useTags());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tags).toEqual(TAGS);
    expect(result.current.error).toBeNull();
  });

  it('exposes the error message when loading fails', async () => {
    vi.mocked(tagsApi.list).mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useTags());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('network down');
  });

  it('creates a tag then refetches', async () => {
    const { result } = renderHook(() => useTags());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.createTag({ name: 'new', color: '#000000' }));

    expect(tagsApi.create).toHaveBeenCalledWith({ name: 'new', color: '#000000' });
    expect(tagsApi.list).toHaveBeenCalledTimes(2);
  });

  it('deletes a tag then refetches', async () => {
    const { result } = renderHook(() => useTags());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.deleteTag('tag_a'));

    expect(tagsApi.remove).toHaveBeenCalledWith('tag_a');
    expect(tagsApi.list).toHaveBeenCalledTimes(2);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, request } from './http';

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

describe('request', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps the data envelope on success', async () => {
    mockFetch(200, { data: [{ id: 'tag_a' }], meta: { total: 1, page: 1, pageSize: 20 } });
    const result = await request<{ id: string }[]>('/api/tags');
    expect(result.data).toEqual([{ id: 'tag_a' }]);
    expect(result.meta?.total).toBe(1);
  });

  it('sends JSON bodies with the right method and headers', async () => {
    mockFetch(201, { data: { id: 'tag_new' } });
    await request('/api/tags', { method: 'POST', body: { name: 'x', color: '#000000' } });
    expect(fetch).toHaveBeenCalledWith('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'x', color: '#000000' }),
    });
  });

  it('throws ApiError with the envelope code and message on failure', async () => {
    mockFetch(404, { error: { code: 'NOT_FOUND', message: "Tag 'x' not found" } });
    const err = await request('/api/tags/x').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe('NOT_FOUND');
    expect((err as ApiError).status).toBe(404);
  });

  it('throws ApiError when a 2xx body is not the data envelope', async () => {
    mockFetch(200, [{ id: 'tag_a' }]);
    const err = await request('/api/tags').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe('INTERNAL');
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 502, json: () => Promise.reject() }),
    );
    const err = await request('/api/tags').catch((e: unknown) => e);
    expect((err as ApiError).message).toContain('502');
    expect((err as ApiError).code).toBe('INTERNAL');
  });
});

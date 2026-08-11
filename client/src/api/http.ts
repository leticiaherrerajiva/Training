import type { ApiErrorBody, ApiErrorCode, PageMeta } from '@taskboard/shared';

/** Thrown for any non-2xx API response; carries the envelope's code and message. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

/**
 * Fetch wrapper used by every api/ module: unwraps the { data, meta } envelope
 * on success and throws ApiError on failure. Components never call fetch directly.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: PageMeta }> {
  const res = await fetch(path, {
    method: options.method ?? 'GET',
    headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let code: ApiErrorCode = 'INTERNAL';
    let message = `Request failed with status ${res.status}`;
    let details: unknown;
    try {
      const body = (await res.json()) as ApiErrorBody;
      code = body.error.code;
      message = body.error.message;
      details = body.error.details;
    } catch {
      // Non-JSON error body; keep the fallback message.
    }
    throw new ApiError(res.status, code, message, details);
  }

  const body = (await res.json()) as { data: T; meta?: PageMeta };
  if (body === null || typeof body !== 'object' || !('data' in body)) {
    throw new ApiError(res.status, 'INTERNAL', 'Unexpected response shape from the API');
  }
  return body;
}

import type { Response } from 'express';
import type { ApiErrorCode, PageMeta } from '@taskboard/shared';

/**
 * The only two functions allowed to shape API response bodies.
 * Every route sends success through sendData; errorHandler sends errors
 * through sendError. See docs/adr/0001-shared-api-response-envelope.md.
 */
export function sendData<T>(
  res: Response,
  data: T,
  options?: { status?: number; meta?: PageMeta },
) {
  const body = options?.meta ? { data, meta: options.meta } : { data };
  res.status(options?.status ?? 200).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) {
  const error = details === undefined ? { code, message } : { code, message, details };
  res.status(status).json({ error });
}

import type { NextFunction, Request, Response } from 'express';
import { AppError, RateLimitedError } from '../lib/errors';
import { logger } from '../lib/logger';
import { sendError } from '../lib/respond';

/**
 * Maps thrown errors to the API error envelope. Expected failures are
 * AppError subclasses (4xx/502); anything else is an unexpected 500.
 * Express 5 forwards rejected promises from async handlers here automatically.
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    const level = err.status >= 500 ? 'error' : 'warn';
    logger[level](
      'errorHandler',
      `${err.code} on ${req.method} ${req.originalUrl}: ${err.message}`,
    );
    if (err instanceof RateLimitedError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
    }
    sendError(res, err.status, err.code, err.message, err.details);
    return;
  }
  const message = err instanceof Error ? err.message : String(err);
  logger.error('errorHandler', `unhandled error on ${req.method} ${req.originalUrl}: ${message}`);
  sendError(res, 500, 'INTERNAL', 'An unexpected error occurred');
}

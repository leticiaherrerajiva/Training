import type { ApiErrorCode } from '@taskboard/shared';

/**
 * Base class for all expected application errors. Services throw these;
 * middleware/errorHandler.ts maps them to the API error envelope.
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, 'NOT_FOUND', `${resource} '${id}' not found`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}

export class RateLimitedError extends AppError {
  constructor(
    message: string,
    readonly retryAfterSeconds: number,
  ) {
    super(429, 'RATE_LIMITED', message);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string) {
    super(502, 'UPSTREAM_ERROR', message);
  }
}

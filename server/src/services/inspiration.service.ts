import type { InspirationQuote } from '@taskboard/shared';
import { fetchQuote, UpstreamHttpError } from '../clients/inspirationClient';
import { NotFoundError, RateLimitedError, UpstreamError } from '../lib/errors';
import { logger } from '../lib/logger';

/**
 * Wraps the external quote provider and maps its failure modes onto our
 * typed errors. This is the project's reference for handling third-party
 * API errors (404 / 429 / 5xx) — see docs/nfr/.
 */
export const inspirationService = {
  async getQuote(category: string): Promise<InspirationQuote> {
    try {
      return await fetchQuote(category);
    } catch (err) {
      if (err instanceof UpstreamHttpError) {
        if (err.status === 404) {
          throw new NotFoundError('Quote category', category);
        }
        if (err.status === 429) {
          logger.warn('inspiration.service', 'quote provider rate limited us', {
            retryAfterSeconds: err.retryAfterSeconds,
          });
          throw new RateLimitedError(
            'Quote provider is rate limiting requests; try again shortly',
            err.retryAfterSeconds ?? 30,
          );
        }
        logger.error('inspiration.service', 'quote provider failed', { status: err.status });
        throw new UpstreamError('Quote provider is unavailable');
      }
      throw err;
    }
  },
};

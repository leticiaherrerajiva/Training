import { beforeEach, describe, expect, it } from 'vitest';
import { inspirationService } from './inspiration.service';
import { resetInspirationClient } from '../clients/inspirationClient';
import { NotFoundError, RateLimitedError, UpstreamError } from '../lib/errors';

// Reference example for mapping third-party API failures (404/429/5xx)
// onto our typed errors — see docs/nfr/.
describe('inspirationService', () => {
  beforeEach(() => {
    resetInspirationClient();
  });

  it('returns a quote for a known category', async () => {
    const quote = await inspirationService.getQuote('grit');
    expect(quote.category).toBe('grit');
    expect(quote.text).toBeTruthy();
  });

  it('maps an upstream 404 to NotFoundError', async () => {
    await expect(inspirationService.getQuote('nonsense')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('maps an upstream 429 to RateLimitedError with retry-after', async () => {
    // The simulated provider rate-limits every 5th call.
    for (let i = 0; i < 4; i++) await inspirationService.getQuote('grit');
    const err = await inspirationService.getQuote('grit').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(RateLimitedError);
    expect((err as RateLimitedError).retryAfterSeconds).toBeGreaterThan(0);
  });

  it('maps an upstream 500 to UpstreamError (502)', async () => {
    const err = await inspirationService.getQuote('flaky').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect((err as UpstreamError).status).toBe(502);
  });
});

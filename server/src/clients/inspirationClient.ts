import type { InspirationQuote } from '@taskboard/shared';

/**
 * Simulates a third-party quote API so the lab has an "external dependency"
 * with realistic failure modes and no network access required:
 *   - unknown category  -> 404
 *   - every 5th call    -> 429 (rate limited, with retry-after)
 *   - category "flaky"  -> 500
 */

const QUOTES: Record<string, InspirationQuote[]> = {
  grit: [
    {
      text: 'It always seems impossible until it is done.',
      author: 'Nelson Mandela',
      category: 'grit',
    },
    { text: 'Fall seven times, stand up eight.', author: 'Japanese proverb', category: 'grit' },
    { text: 'The obstacle is the way.', author: 'Marcus Aurelius', category: 'grit' },
  ],
  focus: [
    {
      text: 'The main thing is to keep the main thing the main thing.',
      author: 'Stephen Covey',
      category: 'focus',
    },
    {
      text: 'Simplicity is the ultimate sophistication.',
      author: 'Leonardo da Vinci',
      category: 'focus',
    },
    { text: 'Beware the barrenness of a busy life.', author: 'Socrates', category: 'focus' },
  ],
  teamwork: [
    {
      text: 'If you want to go far, go together.',
      author: 'African proverb',
      category: 'teamwork',
    },
    {
      text: 'Talent wins games, but teamwork wins championships.',
      author: 'Michael Jordan',
      category: 'teamwork',
    },
    { text: 'None of us is as smart as all of us.', author: 'Ken Blanchard', category: 'teamwork' },
  ],
};

export class UpstreamHttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'UpstreamHttpError';
  }
}

let callCount = 0;

/** Test hook: reset the simulated rate-limit window. */
export function resetInspirationClient(): void {
  callCount = 0;
}

export async function fetchQuote(category: string): Promise<InspirationQuote> {
  callCount += 1;
  if (callCount % 5 === 0) {
    throw new UpstreamHttpError(429, 'Too many requests', 30);
  }
  if (category === 'flaky') {
    throw new UpstreamHttpError(500, 'Internal server error at quote provider');
  }
  const quotes = QUOTES[category];
  if (!quotes) {
    throw new UpstreamHttpError(404, `No such quote category: ${category}`);
  }
  return quotes[callCount % quotes.length]!;
}

export const INSPIRATION_CATEGORIES = Object.keys(QUOTES);

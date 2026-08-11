# NFR-0001: External API error handling

- **Status:** Accepted
- **Applies to:** any code that calls a service we don't own (today: the
  inspiration quote provider; tomorrow: anything under `server/src/clients/`)

## The rule

Code that calls an external service MUST NOT let the provider's failures reach
the client raw. Every upstream call is wrapped in a service that maps failures
onto our typed errors:

| Upstream responds         | We throw                              | Client sees                                |
| ------------------------- | ------------------------------------- | ------------------------------------------ |
| 404 (thing doesn't exist) | `NotFoundError`                       | 404, `NOT_FOUND`                           |
| 429 (rate limited)        | `RateLimitedError` with retry seconds | 429, `RATE_LIMITED` + `Retry-After` header |
| Any 5xx / network failure | `UpstreamError`                       | 502, `UPSTREAM_ERROR`                      |

Never surface the provider's own status text, and never return a 500 for a
failure that is the provider's fault — 502 tells the caller "we're fine,
upstream isn't."

## Why

Upstream failures are routine, not exceptional: providers rate-limit, time
out, and go down. If those failures leak raw, the client can't distinguish
"our bug" from "their outage," retry logic can't be written against stable
codes, and error UX degrades to a generic crash. Mapping at the boundary keeps
the envelope contract (ADR-0001) true even when dependencies misbehave.

## How to comply

- Put the raw call in `server/src/clients/<provider>Client.ts`; it may throw
  provider-shaped errors.
- Wrap it in a service that catches those and re-throws our typed errors —
  copy `server/src/services/inspiration.service.ts`.
- Log rate limits at `warn`, provider failures at `error`, via the standard
  logger (`logger.warn('<scope>', …)`).
- On the client, render an inline error state with a retry action — copy
  `client/src/components/inspiration/InspirationWidget.tsx`. Never blank the page.

## How compliance is checked

- Every wrapping service has tests asserting the 404/429/5xx mappings —
  `server/src/services/inspiration.service.test.ts` is the pattern.
- Code review: a route or component importing from `clients/` directly is a
  rejection; only services touch clients.

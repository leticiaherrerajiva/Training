---
paths:
  - 'server/src/**/*.test.ts'
  - 'client/src/**/*.test.ts'
  - 'client/src/**/*.test.tsx'
---

# Testing rules

- Use Vitest. Tests are co-located with the module they cover (`tags.service.ts` → `tags.service.test.ts`).
- Structure test bodies arrange → act → assert; one behavior per `it`.
- Server tests MUST call `makeTestDb()` from `server/src/testing/helpers.ts` in `beforeEach` and its `cleanup()` in `afterEach`. Never touch `server/data/` from a test.
- Never assert against counts or contents of the real seed data — it changes; use the fixture from `makeTestDb()`.
- For any endpoint you add or change, cover the error paths (404, 409, validation 400) as well as the happy path — see `server/src/routes/tags.routes.test.ts` for the pattern.
- Client component tests use Testing Library queries by role/label (no test ids); mock api modules with `vi.mock`, never `fetch` itself (except in `http.test.ts`).

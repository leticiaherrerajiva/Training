# ADR-0002: Repository-only store access

- **Status:** Accepted
- **Date:** 2026-08-13
- **Deciders:** Leticia Herrera

## Context

TaskBoard persists to a JSON file behind `server/src/db/store.ts`. All four
repository modules (`activity`, `lists`, `tags`, `todos`) import
`readDb`/`writeDb` from it; services call repositories; routes call services.
The single exception is `server/src/index.ts`, which calls `ensureDb()` once
at startup — that's boot initialization, not data access. Without a stated
rule, nothing stops a service or route importing the store directly, coupling
business logic to the JSON-file storage format.

## Decision

Only modules under `server/src/repositories/` may import
`server/src/db/store.ts`; the single exception is the boot-time `ensureDb()`
call in `server/src/index.ts`.

## Consequences

- Good: persistence is swappable without touching business logic
- Good: tests can fake the store at one seam (`makeTestDb()`)
- Bad: every new resource needs one more file (its repository)

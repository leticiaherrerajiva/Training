# Project — TaskBoard

Task-board training app: React client + Express API + JSON-file database.
npm-workspaces monorepo: `client/`, `server/`, `shared/`.

## Stack & overview

- Language / runtime: TypeScript (strict) on Node ≥ 20
- Frameworks: React 18 + Vite (client), Express 5 (server), Vitest + zod
- Database: JSON file (`server/data/db.json`) behind a repository layer, seeded from the guarded `server/data/seed.json`
- Shared domain/API types: `@taskboard/shared`, imported as TS source (no build step) — never redeclare them locally

## Commands

- First-time setup: `npm install` then `npm run reset-db`
- Run: `npm run dev` — client (5173) + server (3001) together
- Test: `npm test`; one workspace: `npm test -w server`; one file: `npx vitest run src/services/tags.service.test.ts` from inside that workspace
- Lint: `npm run lint` · Typecheck: `npm run typecheck`
- Reset data: `npm run reset-db` — restores `db.json` from the seed

## Code conventions

- Error handling: throw the typed classes from `server/src/lib/errors.ts` for expected failures; produce responses ONLY with `server/src/lib/respond.ts` — every response uses the `{ data, meta? }` / `{ error: { code, message, details? } }` envelope (see docs/adr/0001)
- Naming / structure: named exports only; one component per file, named after it; feature folders follow Page → Grid → Card (+ Form), e.g. `TagsPage`/`TagGrid`/`TagCard`/`TagForm`; styling is co-located CSS Modules using the design tokens in `client/src/index.css` (no raw hex in component CSS); data hooks return `{ <items>, loading, error, refetch, ...mutators }` — copy the shape of `useTags`
- Logging: `logger.info('<file-basename>', message, meta?)` from `server/src/lib/logger.ts`; bare `console.*` in `server/src` fails lint

## Architecture & key dirs

Request flow: route → service → repository → store. Routes parse input (zod) and respond; services own ALL business rules and throw typed errors; repositories only persist.

- `server/src/routes/` — thin HTTP layer: validate, call service, respond
- `server/src/services/` — business rules; the only layer that records activity
- `server/src/repositories/` — persistence; the ONLY layer allowed to import `server/src/db/store.ts`
- `server/data/` — `seed.json` (canonical, guarded) and generated `db.json`
- `client/src/api/` + `client/src/hooks/` — one module and one hook per resource
- `client/src/components/` — feature folders + shared `ui/` primitives
- `shared/src/` — entities, envelope, and query types used by both tiers
- `docs/` — decisions (`adr/`), cross-cutting rules (`nfr/`), recipes (`best-practices/`)

## Reference docs — read on demand

This file is always in context; the docs below are NOT. Read the file when its trigger applies:

| When you are…                                   | Read first                                            |
| ----------------------------------------------- | ----------------------------------------------------- |
| Getting oriented in the codebase                | `docs/architecture.md`                                |
| Changing API response shapes or error codes     | `docs/adr/0001-shared-api-response-envelope.md`       |
| Making a new architectural decision             | `docs/adr/template.md` (then add an ADR)              |
| Calling or wrapping an external/third-party API | `docs/nfr/0001-external-api-error-handling.md`        |
| Adding a new resource/entity                    | `docs/best-practices/adding-a-resource.md`            |
| Writing or changing tests                       | `.claude/rules/testing.md` (auto-loads on test files) |

## Testing approach

- Vitest, co-located with the module under test (`x.service.ts` → `x.service.test.ts`)
- Server tests MUST create their data dir via `makeTestDb()` from `server/src/testing/helpers.ts` — never read or assert against the real seed data
- Cover the error paths (404/409/validation) for any endpoint you touch — `tags.routes.test.ts` is the pattern
- Run `npm test`, `npm run lint`, and `npm run typecheck` before every PR

## Deployment

- No hosted deployment: CI (GitHub Actions) runs lint + typecheck + tests on every PR and push to main, and must be green
- Branches `feat/<slug>` / `fix/<slug>`; Conventional Commits; PRs link their issue with `Closes #N`
- Gotchas: Express 5 auto-forwards rejected async handlers to the error middleware — do not add try/catch or wrappers in routes; the client proxies `/api` → :3001, so client API paths are origin-relative; `db.json` is gitignored and generated (a missing db.json is not a bug); `/api/inspiration` simulates a flaky third-party API — its 404/429/500 responses are intended behavior

## Do / Don't

- Do: record architectural decisions in `docs/adr/` (template provided); put cross-cutting rules in `docs/nfr/` (copy the form of NFR-0001); team recipes live in `docs/best-practices/`
- Do: reuse the tags vertical slice as the reference implementation when adding a resource
- Don't: NEVER modify `server/data/seed.json` — it is the canonical baseline every lab resets to (also enforced by a deny rule and a PreToolUse hook); change data via the API or `db.json`, then `npm run reset-db`; done means seed.json has no diff
- Don't: access `db.json` outside `server/src/repositories/` — routes and services never import `db/store.ts`
- Don't: never commit secrets — this repo needs no credentials; anything resembling one is a mistake

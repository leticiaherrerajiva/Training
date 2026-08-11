# TaskBoard architecture

One page. For directives Claude must follow, see [CLAUDE.md](../CLAUDE.md); for
the response-envelope decision, see [ADR-0001](adr/0001-shared-api-response-envelope.md).

## The two apps

```
client (Vite + React 18, :5173)          server (Express 5, :3001)
┌───────────────────────────┐            ┌──────────────────────────────┐
│ components/<feature>/     │            │ routes/    parse + respond   │
│   Page → Grid → Card      │   /api →   │   ↓                          │
│ hooks/use<Resource>       │  (proxy)   │ services/  business rules    │
│ api/<resource>Api ─ http  │──────────► │   ↓                          │
│ context/TodoFilters       │            │ repositories/  persistence   │
└───────────────────────────┘            │   ↓                          │
                                         │ db/store.ts → data/db.json   │
        shared/src/types.ts ◄────────────┴──────────────────────────────┘
        (entities + envelope, imported by both tiers as TS source)
```

## Request lifecycle (server)

1. `routes/<resource>.routes.ts` — validates input with the zod schema from
   `schemas/`, calls the service, sends the result with `lib/respond.ts`.
2. `services/<resource>.service.ts` — owns all business rules (uniqueness,
   cascade checks, activity recording); throws typed errors from `lib/errors.ts`.
3. `repositories/<resource>.repository.ts` — pure persistence; the only layer
   that may import `db/store.ts`.
4. `db/store.ts` — reads/writes `data/db.json` atomically (temp file + rename).
   `db.json` is generated from `data/seed.json` on boot and by `npm run reset-db`.

Errors thrown anywhere land in `middleware/errorHandler.ts`, which maps them to
the shared error envelope (429s also get a `Retry-After` header). Express 5
forwards rejected async handlers automatically — routes contain no try/catch.

## Client patterns

- One api module per resource (`api/tagsApi.ts`) over one fetch wrapper
  (`api/http.ts`) that unwraps the envelope and throws `ApiError`.
- One data hook per resource (`hooks/useTags.ts`) returning
  `{ items, loading, error, refetch, ...mutators }`; mutators call the api
  module then refetch.
- Feature folders under `components/` follow Page → Grid → Card (+ Form in a
  `ui/Modal`); shared primitives live in `components/ui/`.
- The only cross-component state is `context/TodoFiltersContext.tsx` (filter
  bar ↔ todo grid); everything else is local state.

## The simulated external API

`clients/inspirationClient.ts` fakes a third-party quote provider with
deterministic failure modes (unknown category → 404, every 5th call → 429,
category `flaky` → 500). `services/inspiration.service.ts` maps those onto our
typed errors and is the reference implementation for external-API error
handling.

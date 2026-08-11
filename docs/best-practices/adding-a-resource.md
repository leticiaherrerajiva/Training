# Best practice: adding a new resource

When TaskBoard needs a new entity (say, `comments`), don't design from
scratch — replicate the **tags vertical slice**, which is the reference
implementation on both tiers. Work top of the list to the bottom; each step
has a file to copy the shape of.

## Server (in dependency order)

1. **Types** — add the entity to `shared/src/types.ts`. Both tiers import
   from `@taskboard/shared`; never redeclare locally.
2. **Schema** — `server/src/schemas/comments.schema.ts`: zod schemas named
   `createCommentSchema` / `updateCommentSchema` (+ `commentQuerySchema` if
   listable with filters).
3. **Repository** — `server/src/repositories/comments.repository.ts`:
   `findAll/findById/insert/update/remove`, no business logic, the only layer
   importing `db/store.ts`. Copy `tags.repository.ts`.
4. **Service** — `server/src/services/comments.service.ts`: exported
   `commentsService` object owning every business rule; throw typed errors
   from `lib/errors.ts`; log with `logger.info('comments.service', …)`.
5. **Routes** — `server/src/routes/comments.routes.ts`: thin — parse with
   `parseWith`, call the service, respond with `sendData`. Mount in
   `routes/index.ts`.
6. **Tests as you go** — repository, service (happy + error paths), routes
   via supertest with `makeTestDb()`. `tags.*.test.ts` are the patterns.

## Client

7. **API module** — `client/src/api/commentsApi.ts` over `http.ts`.
8. **Hook** — `client/src/hooks/useComments.ts` returning
   `{ comments, loading, error, refetch, ...mutators }`.
9. **Components** — feature folder `components/comments/` with
   Page → Grid → Card (+ Form in a `ui/Modal`); co-located CSS Modules using
   the tokens in `index.css`.
10. **Tests** — Grid states (loading/error/empty/data), Form submit/error,
    hook with `vi.mock`'d api module. See `components/tags/*.test.tsx`.

## Also remember

- Seed data: extend `server/data/seed.json` **via a PR flagged to the
  instructor** — never edit it casually (it's guarded).
- Cascade rules live in services (see how deleting a list checks for todos).
- If the resource changes the API contract in a non-obvious way, write an ADR.

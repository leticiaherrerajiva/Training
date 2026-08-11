# ADR-0001: Shared API response envelope

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** TaskBoard maintainers

## Context

Early endpoints returned whatever shape was convenient: bare arrays, objects
with ad-hoc `message` fields, and error bodies that differed between routes.
The client had to special-case each endpoint, and error handling was
copy-pasted with subtle differences. We needed one predictable contract that
both tiers could build helpers around, including a stable way to carry
pagination metadata and machine-readable error codes.

## Decision

Every API response uses a single envelope, defined in `shared/src/types.ts`:

- Success: `{ "data": <payload>, "meta": { total, page, pageSize }? }`
- Error: `{ "error": { "code": <ApiErrorCode>, "message": <human text>, "details": <optional> } }`

The envelope is produced in exactly two places — `server/src/lib/respond.ts`
(`sendData`/`sendError`) and `server/src/middleware/errorHandler.ts` — and
consumed in exactly one place on the client, `client/src/api/http.ts`, which
unwraps `data` and throws a typed `ApiError` otherwise. Routes never call
`res.json` directly. The error `code` values (`VALIDATION_ERROR`, `NOT_FOUND`,
`CONFLICT`, `RATE_LIMITED`, `UPSTREAM_ERROR`, `INTERNAL`) are a public
contract: clients may branch on them, so renaming one is a breaking change.

## Consequences

- Client data access collapses into one `request<T>()` helper; components get
  consistent `ApiError` objects with codes they can branch on.
- Tests can assert error shapes generically (`body.error.code`), and new
  endpoints inherit correct behavior by throwing typed errors and letting the
  error middleware respond.
- Slight verbosity: single-value responses still nest under `data`, and adding
  a new error category means updating the shared `ApiErrorCode` union first.
- The code list is append-only in practice; removing or renaming a code
  requires a coordinated client change and a new ADR.

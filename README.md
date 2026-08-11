# TaskBoard — FSL AI-Workflows Training Lab

A deliberately realistic task-board app used in FullStack Labs' AI-assisted
development training. You'll use this codebase throughout the labs to practice
real workflows with Claude Code: shipping reviewed PRs, encoding team
conventions, building guardrails, and running pattern-aware code generation.

It looks and behaves like a production codebase on purpose — layered
architecture, shared conventions, CI, seeded data, **and a few real bugs in the
issue backlog**. Treat it like you'd treat work code.

## Getting your copy

1. Click **Use this template → Create a new repository** (public or private, your account).
2. Clone your copy, then from the repo root run the setup script for your platform — it creates the training labels + backlog issues in YOUR repo:

```bash
./scripts/setup-repo.sh      # macOS / Linux
```

```powershell
.\scripts\setup-repo.ps1     # Windows (PowerShell)
```

> Template copies don't inherit issues, so this script seeds your working
> backlog. Add `--protect-main` (bash) or `-ProtectMain` (PowerShell) to also
> require PRs with green CI on main. Re-running is safe: issues that already
> exist are skipped.

## Quickstart

Requires Node 20+ (`nvm use` picks it up from `.nvmrc`).

```bash
npm install
npm run reset-db     # creates server/data/db.json from the seed
npm run dev          # client on http://localhost:5173, API on http://localhost:3001
```

| Script                               | What it does                                       |
| ------------------------------------ | -------------------------------------------------- |
| `npm run dev`                        | Run client + server together                       |
| `npm test`                           | All tests (`-w server` / `-w client` for one tier) |
| `npm run lint` / `npm run typecheck` | What CI runs on every PR                           |
| `npm run reset-db`                   | Restore the database to the canonical seed         |

## Architecture at a glance

Three npm workspaces: `client/` (Vite + React 18 + TS), `server/` (Express 5 +
TS), `shared/` (types both tiers import). The server is layered **route →
service → repository → store**, persisting to a JSON file behind a repository
boundary; every response uses a shared envelope. Details in
[docs/architecture.md](docs/architecture.md) and
[docs/adr/](docs/adr/) — and [CLAUDE.md](CLAUDE.md) is the working example of a
project context file, worth reading on its own.

## How the labs use this repo

- **Lab 1 — First AI-assisted task.** Run `./scripts/setup-repo.sh`, pick an
  issue labeled `lab-1` from your backlog, and ship it as a reviewed,
  CI-green PR using Plan Mode — tests included. The CLAUDE.md here is your
  reference for what a good context file looks like.
- **Lab 2 — AI-document governance.** This repo ships exactly one worked
  example of each governance artifact: one ADR
  ([docs/adr/0001](docs/adr/0001-shared-api-response-envelope.md)), one hook
  guardrail ([.claude/hooks/protect-seed.js](.claude/hooks/protect-seed.js)),
  one scoped rules file ([.claude/rules/testing.md](.claude/rules/testing.md)).
  The gaps are yours to fill: an ADR for a decision that's in the code but
  undocumented, the first [docs/nfr/](docs/nfr/) document, and a
  database-safety guardrail.
- **Lab 3 — Hypr pipeline.** The repeated conventions across route/service/
  repository files and the parallel component slices are what
  pattern assessment extracts. Run the assessment here, then ship a scoped
  feature chunk through the generated agents.
- **Lab 4 — Capstone.** Author your own artifact in `.claude/` (subagent,
  skill, workflow automation) or a governance doc, and use it on a real task
  in this repo.

## Known quirks

- The test suite is intentionally incomplete — some modules have exemplary
  coverage, others have gaps. Part of your job is closing them.
- The backlog issues are real: the bugs they describe are in this code.
- `/api/inspiration` simulates a flaky third-party API (404/429/500 on
  purpose). Its failures are features.
- `server/data/seed.json` is the canonical baseline and is guarded — see the
  Critical rules in [CLAUDE.md](CLAUDE.md).

## Troubleshooting

- **Port in use:** the server takes `PORT` from the environment; the client
  proxy targets 3001, so change both if you move it.
- **Node version errors:** `nvm use` (needs ≥ 20; Vite requires 20.19+).
- **Weird data state:** `npm run reset-db` restores the seed.
- **Windows:** use the PowerShell scripts (`.\scripts\setup-repo.ps1`,
  `.\scripts\seed-issues.ps1`) — they mirror the `.sh` versions. If your
  execution policy blocks them, run
  `powershell -ExecutionPolicy Bypass -File .\scripts\setup-repo.ps1`.
  The app itself runs fine on any OS.

## License

MIT — see [LICENSE](LICENSE).

# Instructor notes: alignment with FSL practices

This doc maps the repo's state against the FSL AI-Transformation-Playbook's
repo criteria (codebase-intake worksheet, maturity model) and the Enterprise
AI Architecture governance framework. It records which gaps are **intentional
teaching material** (and which lab closes them) and which deltas are
**accepted by design** for a training repo. Audience: instructors; it is
deliberately not linked from the student-facing README.

## Deliberate teaching gaps

| Gap                                                                   | Where it shows                                         | Closed by | Maturity target      |
| --------------------------------------------------------------------- | ------------------------------------------------------ | --------- | -------------------- |
| Planted bugs (stats, search, pagination, overdue)                     | Backlog issues #4–#9; code                             | Lab 1     | AI-assisted delivery |
| Test gaps (stats, todos filters, dates, activity, most client slices) | Modules without co-located tests                       | Labs 1, 3 | Test discipline      |
| ADR-0002 (repository pattern) embodied but undocumented               | `server/src/repositories/` vs empty slot in `docs/adr` | Lab 2     | Stage 3 governance   |
| NFR docs beyond NFR-0001 (logging, DB safety)                         | `docs/nfr/README.md` candidates list                   | Lab 2     | Stage 3 governance   |
| "Read-only db.json unless approved" guardrail                         | Only seed.json is hook-guarded today                   | Lab 2     | Stage 3 governance   |
| No `.claude/agents/`, skills, or MCP config                           | `.claude/` contains settings/hooks/rules only          | Labs 3–4  | Stage 3–4 tooling    |
| No coverage threshold in CI                                           | `ci.yml` runs tests without a gate                     | By design | — (see below)        |

The coverage gate stays off permanently: enforcing one would break the planted
test gaps that Labs 1 and 3 depend on. Cohorts that finish the labs can add a
gate as a stretch exercise.

## Accepted deltas vs the playbook intake worksheet

- **No `AGENTS.md` / `.cursorrules`** — the Enterprise AI Architecture
  framework standardizes on CLAUDE.md (+ rules) as the single config surface;
  the labs are Claude Code-centric. Multi-tool checkboxes are knowingly unmet.
- **No CODEOWNERS / required reviewers** — student template copies are
  single-owner repos; review discipline is taught through the PR flow and the
  optional `--protect-main` branch protection in `setup-repo.sh`.
- **No Stage-4 AI-in-CI (AI review/test-gen gates) and no MCP integrations** —
  these assume org infrastructure a standalone public training repo cannot
  carry; they are course topics, not repo artifacts.

## Accepted deltas vs the Enterprise AI Architecture framework

Each item notes the future-hardening step if this repo (or a fork) ever needs
to model full compliance.

- **Seed guardrail is Tier 2 only.** The CLAUDE.md directive + deny rule +
  PreToolUse hook all act client-side; there is no server-side (Tier 1)
  backstop such as a CI check or CODEOWNERS path rule on
  `server/data/seed.json`. Accepted: the guarded asset is versioned and
  trivially recoverable via git, and the three-layer client chain is itself
  the teaching exhibit. _Hardening: add a CI job failing PRs that touch
  seed.json without an instructor-approved label._
- **No policy registry, policy-ID tags, `ai-manifest.json`, or `WAIVERS.md`.**
  Org-scale machinery that would raise the entry cost of Lab 2 without adding
  teaching value at this stage. _Hardening: tag rules/hooks with policy IDs
  and add a manifest once students are past the basics._
- **NFR-0001 is prose + an on-demand pointer**, not the framework's two-level
  pattern (one always-in-force binding line + lazy full spec). _Hardening: add
  a one-line binding rule to CLAUDE.md referencing NFR-0001._
- **ADR template is lightweight** (Context / Decision / Consequences) rather
  than MADR-style with "Options considered" and supersede links. _Hardening:
  extend `docs/adr/template.md` with an options section._
- **No CI secret scan / push protection.** The repo carries no credentials and
  states so in CLAUDE.md. _Hardening: enable GitHub push protection and add a
  gitleaks CI step._

## What the repo intentionally models well

Point students here when teaching the corresponding lesson:

- **Defense-in-depth guardrail** — CLAUDE.md directive + `permissions.deny` +
  `.claude/hooks/protect-seed.js` (a Node hook, per the framework's
  cross-platform rule), all naming the same path and remediation.
- **Context layering** — always-loaded CLAUDE.md (FSL Lab-1 template, 72
  lines) → on-demand `docs/` via the trigger table → `paths:`-scoped
  `.claude/rules/testing.md`.
- **Governance starter set** — one worked example each of ADR, NFR, and
  best-practice doc, with the gaps named for students.
- **Conventions that hold under audit** — store access only via repositories,
  responses only via envelope helpers, no bare console, one fetch wrapper
  (verified by grep, enforced by lint where possible).
- **Template-repo distribution** — issues/labels seeded per copy by idempotent
  cross-platform scripts (`.sh` + `.ps1`).

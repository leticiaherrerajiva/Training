#!/usr/bin/env bash
# Lab 2 — optional. Seeds the lab-2 label and backlog issues in YOUR copy of
# the repo, so your governance work keeps the same "Closes #N" PR discipline
# you used in Lab 1.
#
# Your copy was created before these issues existed, and template copies do
# not inherit later changes — hence this script rather than a repo update.
#
# Usage, from your repo root:
#   curl -fsSL https://raw.githubusercontent.com/mike-tajmajer-fullstacklabs/fsl-taskboard-lab/main/docs/labs/snippets/seed-lab2-issues.sh | bash
# or, if you already pulled docs/labs:
#   bash docs/labs/snippets/seed-lab2-issues.sh
#
# Idempotent: labels are upserted and issues whose titles already exist are skipped.
set -euo pipefail

command -v gh >/dev/null || { echo "GitHub CLI (gh) not found — install it or skip this script."; exit 1; }

echo "Creating labels…"
gh label create lab-2 --color 1d76db --description "Suitable for Lab 2 (governance & guardrails)" --force
gh label create governance --color 998dd9 --description "AI-governance / documentation work" --force

existing_titles="$(gh issue list --state all --limit 200 --json title --jq '.[].title')"

# Usage: create_issue "<title>" [gh flags…] <<'EOF' … EOF
# Body arrives on stdin — heredocs inside $(...) break on macOS bash 3.2.
create_issue() {
  local title="$1"
  shift
  if printf '%s\n' "$existing_titles" | grep -Fxq "$title"; then
    echo "skipped (already exists): $title"
    return 0
  fi
  gh issue create --title "$title" "$@" --body-file -
}

create_issue 'Document the repository-pattern decision as an ADR' \
  --label governance --label lab-2 <<'EOF'
## What and why
`server/src/repositories/` is the only layer allowed to import `server/src/db/store.ts`.
That boundary is real, it is load-bearing, and nowhere in the repo records *why* it
was chosen or what it costs.

## Done when
- A new ADR exists in `docs/adr/`, following `docs/adr/template.md`
- It reads as a decision, not a description: someone who disagreed with it can see what
  they would be arguing against
- Consequences include at least one honest cost
- Peer-reviewed via PR
EOF

create_issue 'Write the NFR for test discipline' \
  --label governance --label lab-2 <<'EOF'
## What and why
Lab 1.b established a working habit: reproduce, write a failing test, fix, verify, ship.
A habit that lives only in people's heads is not a standard. Write it down as an NFR.

## Done when
- A new doc exists in `docs/nfr/`, copying the form of `docs/nfr/0001-external-api-error-handling.md`
- Every clause states **how compliance is checked**
- Clauses that CANNOT be checked mechanically are marked as such, with a recorded
  decision for each: accepted risk, human gate, or dropped
- Peer-reviewed via PR
EOF

create_issue 'Write the NFR for the database-access boundary' \
  --label governance --label lab-2 <<'EOF'
## What and why
CLAUDE.md says routes and services must never import `db/store.ts`. Nothing checks it.
`docs/nfr/README.md` already lists this as a candidate.

## Done when
- A new doc exists in `docs/nfr/` with the same structure as the test-discipline NFR
- Every clause states how compliance is checked
- Peer-reviewed via PR
EOF

create_issue 'Wire the new governance docs into CLAUDE.md' \
  --label governance --label lab-2 <<'EOF'
## What and why
A doc nothing points at is a doc nobody reads — including Claude. CLAUDE.md is always
in context; `docs/` is not.

## Done when
- Each new doc has a row in the "Reference docs — read on demand" trigger table, with a
  trigger phrased as a situation the reader is in
- The NFR has one binding line in CLAUDE.md so it applies without being fetched
- Smoke-tested: in a FRESH session, ask Claude the rule and confirm it reads the doc
- Peer-reviewed via PR
EOF

create_issue 'Add a guardrail that enforces one clause of your NFR' \
  --label governance --label lab-2 <<'EOF'
## What and why
Lab 2.b. A written standard nobody enforces is a document nobody follows.

## Done when
- A hook exists in `.claude/hooks/` and is registered in `.claude/settings.json`
- **Verified in both directions**: it refuses the disallowed action AND permits the
  allowed one, with no false positive on a real recent change
- The severity is a deliberate choice — block or nudge — and the reason is written down
- The bypass path is documented
- Peer-reviewed via PR, and demonstrated firing in a live agent run
EOF

echo "Done. Run 'gh issue list --label lab-2' to see them."

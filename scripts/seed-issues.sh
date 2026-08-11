#!/usr/bin/env bash
# Creates the training labels and the lab backlog issues in YOUR copy of the
# repo. Run from the repo root after cloning your template copy:
#   ./scripts/seed-issues.sh
# Requires the GitHub CLI (`gh`) authenticated against your account.
# Idempotent: labels are upserted and issues whose titles already exist
# (open or closed) are skipped, so re-running is safe.
set -euo pipefail

if ! gh repo view >/dev/null 2>&1; then
  echo "error: run this from inside your cloned repo with gh authenticated" >&2
  exit 1
fi

echo "Creating labels…"
gh label create bug --color d73a4a --description "Something behaves incorrectly" --force
gh label create feature --color a2eeef --description "New capability" --force
gh label create lab-1 --color 0e8a16 --description "Suitable for Lab 1 (first AI-assisted PR)" --force
gh label create good-first-issue --color 7057ff --description "Small, well-scoped starter task" --force
gh label create governance --color 998dd9 --description "AI-governance / documentation work" --force

echo "Creating issues…"
existing_titles="$(gh issue list --state all --limit 200 --json title --jq '.[].title')"

# Usage: create_issue "<title>" [gh issue create flags…] <<'EOF' … EOF
# The heredoc on stdin becomes the issue body (works on macOS's bash 3.2).
create_issue() {
  local title="$1"
  shift
  if printf '%s\n' "$existing_titles" | grep -Fxq "$title"; then
    echo "skipped (already exists): $title"
    cat >/dev/null # drain the heredoc so set -o pipefail scripts stay happy
    return 0
  fi
  gh issue create --title "$title" "$@" --body-file -
}

create_issue 'Stats "Completed this week" always shows 0' \
  --label bug --label lab-1 --label good-first-issue <<'EOF'
## What happens
The "Completed this week" card on the Stats page shows 0 — even immediately after completing a todo.

## Steps to reproduce
1. `npm run reset-db && npm run dev`
2. On the Todos tab, mark any open todo as Done.
3. Open the Stats tab.

## What should happen instead
The card should count todos completed within the last 7 days (the one you just completed included).

## Notes
The rest of the summary numbers (total/open/done) look right.
EOF

create_issue 'Todo search is case-sensitive' \
  --label bug --label lab-1 --label good-first-issue <<'EOF'
## What happens
Searching todos for `report` does not find "Draft Weekly Report for stakeholders"; searching `Report` misses "Collect report figures from analytics". Only exact-case matches are returned.

## Steps to reproduce
1. `npm run reset-db && npm run dev`
2. In the Todos search box, type `report`.

## What should happen instead
Search should be case-insensitive and cover both title and notes.
EOF

create_issue 'Pagination total is wrong when results span pages' \
  --label bug --label lab-1 <<'EOF'
## What happens
`GET /api/todos` returns `meta.total` equal to the number of items on the current page, not the number of matching todos. With the seed data (25 todos, page size 20), page 1 reports `total: 20` and page 2 reports `total: 5` — so the pager in the filter bar shows "Page 1 of 1" and the "(N todos)" count is wrong.

## Steps to reproduce
1. `npm run reset-db && npm run dev`
2. `curl -s 'localhost:3001/api/todos?page=1' | jq '.meta'`

## What should happen instead
`meta.total` should be the count of todos matching the filters, independent of pagination.
EOF

create_issue 'Todos due today are flagged as overdue' \
  --label bug --label lab-1 --label good-first-issue <<'EOF'
## What happens
A todo whose due date is today shows the red "Overdue" badge all day.

## Steps to reproduce
1. `npm run dev`
2. Create a todo due today (pick the current date in the due-date field).
3. It immediately renders with the "Overdue" badge.

## What should happen instead
A todo is overdue only once its due date is in the past; something due today is not overdue.
EOF

create_issue 'Add a "Clear completed" action' \
  --label feature --label lab-1 <<'EOF'
## What and why
Done todos pile up. Add a way to delete all completed todos in one action, optionally scoped to the currently selected list.

## Acceptance criteria
- [ ] New endpoint following the existing route → service → repository pattern and response envelope
- [ ] An activity entry is recorded per deleted todo
- [ ] A "Clear completed" button in the todo filter bar, with the count of affected todos
- [ ] Server and client tests for the new behavior
EOF

create_issue 'Support sorting todos by due date' \
  --label feature --label lab-1 <<'EOF'
## What and why
`GET /api/todos` only supports `sort=createdAt`. Sorting by due date helps planning the day.

## Acceptance criteria
- [ ] `sort=dueDate` accepted by the query schema; todos without a due date sort last
- [ ] A sort selector in the todo filter bar
- [ ] Tests covering the new sort, including todos with no due date
EOF

echo "Done. View them with: gh issue list"

#!/usr/bin/env bash
# One-time setup for YOUR copy of the template repo:
#   1. seeds the training labels + backlog issues
#   2. (optional) protects main so changes land via PR with green CI
# Run from the repo root: ./scripts/setup-repo.sh [--protect-main]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/seed-issues.sh"

if [[ "${1:-}" == "--protect-main" ]]; then
  REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
  echo "Protecting main on $REPO (PRs required, ci check required)…"
  gh api --method PUT "repos/$REPO/branches/main/protection" \
    --field 'required_status_checks[strict]=true' \
    --field 'required_status_checks[checks][][context]=ci' \
    --field 'enforce_admins=false' \
    --field 'required_pull_request_reviews[required_approving_review_count]=0' \
    --field 'restrictions=null' \
    >/dev/null
  echo "Branch protection enabled."
else
  echo "Tip: re-run with --protect-main to require PRs + green CI on main."
fi

echo "Setup complete."

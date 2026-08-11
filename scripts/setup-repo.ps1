#!/usr/bin/env pwsh
# One-time setup for YOUR copy of the template repo (PowerShell port of
# setup-repo.sh):
#   1. seeds the training labels + backlog issues
#   2. (optional) protects main so changes land via PR with green CI
# Run from the repo root: .\scripts\setup-repo.ps1 [-ProtectMain]
param(
    [switch]$ProtectMain
)

$ErrorActionPreference = 'Stop'

& (Join-Path $PSScriptRoot 'seed-issues.ps1')
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

if ($ProtectMain) {
    $repo = gh repo view --json nameWithOwner --jq .nameWithOwner
    Write-Host "Protecting main on $repo (PRs required, ci check required)…"
    gh api --method PUT "repos/$repo/branches/main/protection" `
        --field 'required_status_checks[strict]=true' `
        --field 'required_status_checks[checks][][context]=ci' `
        --field 'enforce_admins=false' `
        --field 'required_pull_request_reviews[required_approving_review_count]=0' `
        --field 'restrictions=null' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'failed to enable branch protection' }
    Write-Host 'Branch protection enabled.'
}
else {
    Write-Host 'Tip: re-run with -ProtectMain to require PRs + green CI on main.'
}

Write-Host 'Setup complete.'

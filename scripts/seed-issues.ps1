#!/usr/bin/env pwsh
# Creates the training labels and the lab backlog issues in YOUR copy of the
# repo (PowerShell port of seed-issues.sh). Run from the repo root:
#   .\scripts\seed-issues.ps1
# Requires the GitHub CLI (gh) authenticated against your account.
# Idempotent: labels are upserted and issues whose titles already exist
# (open or closed) are skipped, so re-running is safe.

$ErrorActionPreference = 'Stop'

gh repo view *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host 'error: run this from inside your cloned repo with gh authenticated' -ForegroundColor Red
    exit 1
}

Write-Host 'Creating labels…'
gh label create bug --color d73a4a --description 'Something behaves incorrectly' --force
gh label create feature --color a2eeef --description 'New capability' --force
gh label create lab-1 --color 0e8a16 --description 'Suitable for Lab 1 (first AI-assisted PR)' --force
gh label create good-first-issue --color 7057ff --description 'Small, well-scoped starter task' --force
gh label create governance --color 998dd9 --description 'AI-governance / documentation work' --force

Write-Host 'Creating issues…'
$existingTitles = @(gh issue list --state all --limit 200 --json title --jq '.[].title')

function New-LabIssue {
    param(
        [Parameter(Mandatory)] [string]$Title,
        [Parameter(Mandatory)] [string[]]$Labels,
        [Parameter(Mandatory)] [string]$Body
    )
    if ($existingTitles -contains $Title) {
        Write-Host "skipped (already exists): $Title"
        return
    }
    # Body goes through a UTF-8 temp file so non-ASCII text survives Windows PowerShell 5.1.
    $tmp = New-TemporaryFile
    try {
        [System.IO.File]::WriteAllText($tmp.FullName, $Body, [System.Text.UTF8Encoding]::new($false))
        $labelArgs = foreach ($label in $Labels) { '--label'; $label }
        gh issue create --title $Title $labelArgs --body-file $tmp.FullName
        if ($LASTEXITCODE -ne 0) { throw "failed to create issue: $Title" }
    }
    finally {
        Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    }
}

New-LabIssue -Title 'Stats "Completed this week" always shows 0' `
    -Labels 'bug', 'lab-1', 'good-first-issue' -Body @'
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
'@

New-LabIssue -Title 'Todo search is case-sensitive' `
    -Labels 'bug', 'lab-1', 'good-first-issue' -Body @'
## What happens
Searching todos for `report` does not find "Draft Weekly Report for stakeholders"; searching `Report` misses "Collect report figures from analytics". Only exact-case matches are returned.

## Steps to reproduce
1. `npm run reset-db && npm run dev`
2. In the Todos search box, type `report`.

## What should happen instead
Search should be case-insensitive and cover both title and notes.
'@

New-LabIssue -Title 'Pagination total is wrong when results span pages' `
    -Labels 'bug', 'lab-1' -Body @'
## What happens
`GET /api/todos` returns `meta.total` equal to the number of items on the current page, not the number of matching todos. With the seed data (25 todos, page size 20), page 1 reports `total: 20` and page 2 reports `total: 5` — so the pager in the filter bar shows "Page 1 of 1" and the "(N todos)" count is wrong.

## Steps to reproduce
1. `npm run reset-db && npm run dev`
2. `curl -s 'localhost:3001/api/todos?page=1' | jq '.meta'`

## What should happen instead
`meta.total` should be the count of todos matching the filters, independent of pagination.
'@

New-LabIssue -Title 'Todos due today are flagged as overdue' `
    -Labels 'bug', 'lab-1', 'good-first-issue' -Body @'
## What happens
A todo whose due date is today shows the red "Overdue" badge all day.

## Steps to reproduce
1. `npm run dev`
2. Create a todo due today (pick the current date in the due-date field).
3. It immediately renders with the "Overdue" badge.

## What should happen instead
A todo is overdue only once its due date is in the past; something due today is not overdue.
'@

New-LabIssue -Title 'Add a "Clear completed" action' `
    -Labels 'feature', 'lab-1' -Body @'
## What and why
Done todos pile up. Add a way to delete all completed todos in one action, optionally scoped to the currently selected list.

## Acceptance criteria
- [ ] New endpoint following the existing route → service → repository pattern and response envelope
- [ ] An activity entry is recorded per deleted todo
- [ ] A "Clear completed" button in the todo filter bar, with the count of affected todos
- [ ] Server and client tests for the new behavior
'@

New-LabIssue -Title 'Support sorting todos by due date' `
    -Labels 'feature', 'lab-1' -Body @'
## What and why
`GET /api/todos` only supports `sort=createdAt`. Sorting by due date helps planning the day.

## Acceptance criteria
- [ ] `sort=dueDate` accepted by the query schema; todos without a due date sort last
- [ ] A sort selector in the todo filter bar
- [ ] Tests covering the new sort, including todos with no due date
'@

Write-Host 'Done. View them with: gh issue list'

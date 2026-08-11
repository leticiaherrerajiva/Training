# Lab 1.b — Fixing Bugs, Test-First · Presenter Notes

Speaker notes for `lab-1b-bugfix-test-driven.pptx` (same text is attached to each slide's Notes pane).

## Slide 1 · Title

Welcome — this is **Lab 1.b**, the hands-on half of Lab 1. By the end you can fix a real bug the disciplined, test-first way with Claude and open a clean PR. Mixed room (junior + senior): we go step by step; seniors, help your neighbors. ~2 hrs total.

## Slide 2 · Agenda

Set expectations: mostly hands-on. I demo one bug (#5), you fix another (#4), we review together, then a feature if time allows. Note the recap section now also covers HOW to prompt Claude. Keep us honest on timeboxes. ~2 min.

## Slide 3 · Install your tooling

One-time install, ideally before lab day (~10 min). macOS column assumes Homebrew, Windows assumes winget (built into Win 10/11) — fallback for both is each tool’s download page. Why each tool: git drives the branch/PR flow; nvm makes `nvm use` match the repo’s .nvmrc; Node floor is LTS 20.19+ because Vite 7 requires it — 20, 22, or 24 LTS all work, odd majors (23) print engine warnings that confuse people; GitHub CLI powers the issue-seeding script and PR flow (`gh auth login` is the step people forget); Claude Code uses the native installer — self-updating and avoids npm -g permission problems on locked-down machines; any editor is fine, the demo narrates from VS Code. Accounts: a GitHub account plus a company-provisioned Claude Code seat — have everyone run the VERIFY line and complete a Claude login BEFORE lab day; pair anyone broken at the door rather than during the demo.

## Slide 4 · Set up the training repo

Do this before anything hands-on (~2 min). Repo: github.com/mike-tajmajer-fullstacklabs/fsl-taskboard-lab (shown top-left). The green 'Use this template → Create a new repository' button (circled in the screenshot) makes their OWN copy — not Fork, not plain Clone. Then the setup script (`./scripts/setup-repo.sh`, or `.ps1` on Windows) seeds the lab labels + backlog issues, since template copies don't inherit issues — gh auth was handled on the tooling slide. Then `npm install` / `npm run reset-db` / `npm run dev` (Node LTS ≥ 20.19; `nvm use` reads .nvmrc). Confirm `npm test` is green, then pick a `lab-1` issue. If anyone's stuck here, pair them before the demo. Tooling itself was installed on the previous slide — this slide is only about the repo.

## Slide 5 · Recap Lab 1.a

Quick recap only (~3 min). The taskboard repo already ships a CLAUDE.md, so context is done — we are NOT authoring one today. Confirm everyone can run `npm install`, `npm run reset-db`, `npm run dev`, and `npm test`. Pair up anyone whose environment is broken before we start.

## Slide 6 · Why test-first

The core mindset (~3 min). 'A bug is a missing test' — the defect slipped through because no test pinned that behavior. Writing the test first makes the fix provable and permanent. For juniors: the failing test is how you and Claude agree on what 'done' means.

## Slide 7 · The loop

The spine of the whole class — point back to it during the demo and the exercise. Reproduce → RED → Fix (Plan Mode) → GREEN → Ship. Same five steps for bugs AND features. ~2 min.

## Slide 8 · Best practices

How we work with Claude (~3 min). Key habit: paste the failing test into Claude and let CLAUDE.md carry conventions; use Plan Mode; READ the diff. Guardrail callout: `server/data/seed.json` is protected by a PreToolUse hook — a block there is expected, not an error.

## Slide 9 · RTCE = the FSL pattern

This is the 'they're the SAME pattern' slide — the one that clears up the confusion (~2 min). Read the table across, row by row: RTCE's Role tucks into Context; Task = Task; Context = Context; and RTCE's Expectations splits into the Claude Code course's Constraints + Verify (the highlighted row). It's ONE shape with two labelings — nobody needs to memorize two frameworks. Then make the SUPERIORITY point: the FSL grouping is better precisely because of that split — it promotes Verify to its own first-class step, so every prompt states HOW Claude proves it's done ('run the tests'), not just a vague 'Expectations'. Both courses call this the highest-leverage habit ('a prompt is a verification strategy'), and it's what makes a fix provable instead of hopeful. Close with where-it-lives: CLAUDE.md carries the durable Role + Context (versioned + shared), so each prompt only carries Task + Constraints + Verify — the standardization goal in prompt form.

## Slide 10 · Three habits

The three habits that make the shape actually work (~2 min): describe symptoms not solutions (say what you see, let Claude diagnose the root cause), @-reference real files (show, don't describe), and end with 'run the tests' (Claude verifies itself). Each card has a taskboard-flavored example. Tell students these three are what separate a prompt that lands first-try from one that needs three rounds.

## Slide 11 · Same goal, four ways

The key idea for juniors and seniors alike (~4 min): there is NO single magic prompt — the same goal has several good styles. Walk the four: explicit (spell it all out), symptom-first (describe what you see, let Claude diagnose), reference-driven (point at an existing test — 'do it like this'), plan-first (ask for the plan/diagnosis before any code). Encourage them to try a couple of styles when they fix Bug #4.

## Slide 12 · Demo divider

Transition. Tell them: watch the loop end-to-end. I'll switch between these slides and VS Code.

## Slide 13 · Reproduce #5

Reproduce first (~4 min). Show the bug live in the running app: search 'FIRST' vs 'First'. Then open `server/src/services/todos.service.ts` → `list()` and show the `includes()` lines. Say the root cause out loud: `includes()` is case-sensitive and neither side is normalized.

## Slide 14 · RED #5

Write the failing test live in `todos.service.test.ts`, then `npm test -w server` → RED (~6 min). The two prompt variants on the slide (explicit / symptom-first) are starting points; the fuller set is on the 'four ways' slide. Talking point: 'First fixture todo' should match 'first' but won't today — that red test is our precise target.

## Slide 15 · GREEN #5

The fix (~6 min). In VS Code: enter Plan Mode, hand Claude the failing test, ask for the smallest fix (the two fix-prompt styles are on the slide: minimal vs Plan-Mode). Review the plan, apply, rerun → GREEN, then lint + typecheck. The fix is just lowercasing the query and the compared fields; reinforce reading the diff before accepting.

## Slide 16 · Ship #5

Close the loop (~4 min): `git checkout -b fix/case-insensitive-search`, a Conventional Commit, PR 'Closes #5'. Show CI running; require a reviewer. The repo's PR template auto-populates the checklist.

## Slide 17 · Your turn divider

Hand off. Students now fix Bug #4 (solo or pairs), ~40 min. Circulate and coach. Do NOT reveal the root cause — the diagnosis is the exercise. Nudge them to try a different prompt style than I used.

## Slide 18 · The task #4

Brief them (~2 min), then let them work. INSTRUCTOR-ONLY root cause — do not say up front: `stats.service.ts` sets `COMPLETED_STATUS = 'completed'`, but the domain status is `'done'` (see `shared/src/types.ts` and `todosService.complete()`), so the filter never matches → always 0. Nudge them to reproduce and write a failing test before touching the fix.

## Slide 19 · Hints #4

Point stuck students here; the starter scaffold and two no-spoiler prompt starters are on the slide (fuller set on the starter card). Gotcha to surface via questions (not answers): the fixture's completed todo (`todo_c`) is dated Jan 2026 — NOT 'this week' — so they must complete a todo _now_ to expect a nonzero count. If a test passes immediately, the expectation is wrong. Acceptance: a test that failed first then passes; `npm test -w server` + lint + typecheck green; PR 'Closes #4' + a reviewer.

## Slide 20 · Review

~20 min. Pull up 2–3 student diffs/PRs and use the prompts. Best moments: compare two different tests for the same bug, and whether Claude's first attempt passed review. Keep hammering 'the test failed first' as the discipline check.

## Slide 21 · Feature divider

Only if time remains (~15 min). Transition: features use the same loop, but the starting point flips from 'reproduce a defect' to 'specify new behavior.'

## Slide 22 · Bug vs feature

The one conceptual slide for features (~4 min). Bug = behavior exists but is wrong; the test reproduces then pins the correction. Feature = behavior doesn't exist; the test specifies it and fails until built. Same rhythm both ways: test-first → build with Claude → verify → PR.

## Slide 23 · Feature example

Concrete small feature: sort by due date. Two prompt starters on the slide (interview/plan-first vs explicit test-first). Teaching point: adding `sort: 'dueDate'` won't even typecheck until you extend `TodoQuery.sort` in `shared/src/types.ts` — the type/spec drives the change. Stretch goal; if time runs out they continue it in office hours / Slack. (The on-slide test sketch omits `page`/`pageSize` for space — the real call needs them.)

## Slide 24 · Prompt starters card

Reference/screenshot slide — tell students to grab it. One starter per loop step; they swap in their own file paths. Reiterate the three habits (symptoms, @-reference, end with 'run the tests'). Little talking — point them here during the exercise.

## Slide 25 · Wrap

Land the takeaway (~5 min): the LOOP is the transferable skill, not any one bug. Walk the ship checklist. Point everyone to the team's AI-training Slack channel — say the channel name out loud; it's on the cohort setup sheet, not in this public repo — to ask questions and share their PRs.

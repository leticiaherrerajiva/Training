# Lab 2.b — Guardrails, and Making Standards Travel

**Skill:** turning a written rule into something that refuses to be violated — and deciding what to do with the part that can't be.
**Duration:** ~2 hours, facilitated.
**Surface:** your own copy of this repo.

---

## Why this block exists

You now have documents. Nothing enforces them.

The industry has converged on an uncomfortable finding: **the model layer cannot be the
control.** Models are non-deterministic and persuadable. A rule in CLAUDE.md is a strong
suggestion — it will hold most of the time and fail exactly when someone asks for something
reasonable-sounding that happens to violate it. If a rule matters, something deterministic
has to check it.

Two words for the rest of the block:

- A **hook** is an interception point — an event fired right before or after a consequential action.
- A **policy** is the deterministic rule evaluated against that event.

Because the check doesn't depend on which model ran, it still holds when you swap models or
add agents.

## Before the session

- [ ] Lab 2.a complete: your ADR and NFR are committed and wired into CLAUDE.md
- [ ] Your copy runs and `npm test` is green
- [ ] You've done the Claude Code **Hooks** lesson (Extending Claude Code)
- [ ] Pull the snippets folder if you haven't:

```bash
npx giget gh:mike-tajmajer-fullstacklabs/fsl-taskboard-lab/docs/labs docs/labs
```

## The five layers

| Layer                            | Where it lives                                | Holds against                                      |
| -------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| 1. **Instruction**               | CLAUDE.md, docs behind a trigger table        | Nothing, reliably. It informs; it does not enforce |
| 2. **Client-side deterministic** | `.claude/settings.json` permissions + hooks   | The agent, at authoring time                       |
| 3. **Commit-time**               | git hooks, commit lint                        | Anyone committing locally                          |
| 4. **CI gates**                  | workflows, static analysis, custom validators | Anyone merging, agent or human                     |
| 5. **Documented bypass**         | a written escape hatch with a named approver  | Nothing — it's what keeps the other four honest    |

**This repo has 1 and 2 only.** `docs/instructor/alignment.md` says so out loud rather than
pretending otherwise. You'll build within layer 2 and see what 4 costs.

## Warm-up: the cheapest guardrail there is (~5 min, everyone)

`.claude/settings.json` takes three verdicts, not two: **allow**, **ask**, **deny**. No code.

> **Merge these in — don't paste over the file.** Your `.claude/settings.json` already has a
> `permissions.deny` block holding the two `server/data/seed.json` rules, and a `hooks` block
> registering `protect-seed.js`. Both must survive: they're layers 1–2 of the exhibit you'll read
> in the next section, and the demo depends on them. Add the `ask` array, and **append** to the
> existing `deny` array.

```json
{
  "permissions": {
    "ask": ["Bash(rm *)"],
    "deny": [
      "Edit(server/data/seed.json)",
      "Write(server/data/seed.json)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Bash(git clean *)",
      "Bash(npm publish *)",
      "Bash(curl * | bash)"
    ]
  }
}
```

The first two `deny` entries are the ones already in your file — shown so you can see where yours
go, not so you add them twice. Once merged, ask Claude to do one of these things and watch it
refuse. Then confirm you didn't break anything: ask it to edit `server/data/seed.json` and check
that it is still refused.

This is the honest answer to "there are no restore points" and "it did something I didn't
expect." It takes five minutes, needs no code, and works in every repo you own — including
the ones you're shipping from tomorrow. If you take one thing from this block, take this.

## The three-layer pattern, already in this repo

`server/data/seed.json` is protected three times over, and every layer names the same path and
the same remediation:

1. A **Don't** line in `CLAUDE.md`
2. A `permissions.deny` entry in `.claude/settings.json`
3. A `PreToolUse` hook, `.claude/hooks/protect-seed.js`

Read that hook before you write yours — particularly its message, which tells Claude what was
blocked, **why**, what to do instead, and what done looks like. A guardrail that only says
"no" makes the agent guess.

## Block or nudge? Decide, don't default

The exit code you use, on the event you register, _is_ the severity decision:

| Event         | Exit 2 does                                                   | Use for                                             |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| `PreToolUse`  | **Blocks** the call; stderr goes to Claude                    | Unrecoverable or unambiguous violations             |
| `PostToolUse` | Cannot block — the tool ran — but stderr still goes to Claude | Heuristic rules; things you don't want to interrupt |

**Not every guardrail should block.** A gate that fires on legitimate work teaches people to
route around it, and a bypassed gate is worse than no gate because it looks like control.

## What you'll do

### 1. Watch the pattern built end to end

Your instructor extends the read-only-database rule: CLAUDE.md line → deny rule → hook →
**verified in both directions** → bypass documented.

**Checkpoint:** your agent is refused when it edits `db.json` and succeeds when it edits a repository file.

### 2. Enforce your own clause

Take the clause your group derived in 2.a and build **both** enforcement points:

- **Authoring time** — start from `docs/labs/snippets/hook-skeleton.js`. Copy it to
  `.claude/hooks/check-convention.js`, delete the two example rules, put yours in, register it
  in `.claude/settings.json` under the event whose severity you want.
- **Merge time** — start from `docs/labs/snippets/governance-gate.yml`. Copy it to
  `.github/workflows/governance.yml`. Note the `fetch-depth: 0` comment; without it any diff
  against the base branch fails with an unhelpful error.

Then the part that matters most:

- **Verify both directions.** It must refuse the violation _and_ permit a real recent change untouched. An unverified guardrail is a belief.
- **Choose the severity on purpose** and write down why.
- **Document the bypass.** There is always one.
- **Record a decision for every clause you couldn't enforce.** Accepted risk, human gate, or dropped — with a name against it.

### 3. Point the reviewer at your standards

`.claude/agents/taskboard-code-reviewer.md` already reads CLAUDE.md and then whichever
ADRs/NFRs/rules apply. Add your new docs to its list and run it on your own branch. This is
what "feeding the standards to the agent as constraints" actually looks like.

> If your copy has no `.claude/agents/` folder, it was made before that file landed upstream.
> Pull it: `npx giget gh:mike-tajmajer-fullstacklabs/fsl-taskboard-lab/.claude/agents .claude/agents`

## Acceptance criteria

- [ ] The **warm-up** deny/ask list is merged into your `.claude/settings.json` — seed rules and hook intact — and you've seen it refuse something
- [ ] A **hook** in `.claude/hooks/`, registered, enforcing a clause from your own NFR
- [ ] **Verified in both directions**, with no false positive on a real recent change
- [ ] The **severity choice** (block vs nudge) is written down with its reason
- [ ] A **documented bypass**
- [ ] A **recorded decision** for every clause tooling couldn't hold
- [ ] Demonstrated **firing in a live agent run**, reviewed by a teammate via PR, CI green
- [ ] A **"how we use these" README** committed alongside the docs — when each artifact type is warranted, who authors it, who reviews it, and where it lives
- [ ] A **recorded roll-up decision**: which rung of the distribution ladder we start at, what the first move is, and **the name of the person who owns it**
- [ ] **Your port target named** — the one artifact you'll carry into a real repo, and which repo (the port itself happens in office hours, not today)

The last three are the ones people skip because they aren't code. They're the difference between a
lab exercise and a standard your team actually has.

## Stretch

- Compose several rules into one policy bundle
- Add telemetry: count how often the gate fires and how often it's bypassed. A gate with no telemetry can't be falsified
- Extend the existing lint setup to complete a half-enforced rule
- Take the [takeaway card](../best-practices/enforcing-a-convention.md) and sort one of your **own** conventions into mechanical and fuzzy clauses

## Common stuck points

| Symptom                                        | What to do                                                                                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| The hook fires when it shouldn't               | Narrow the trigger — then **re-verify the allow case**. Fixing a false positive by loosening the block is how gates die           |
| The hook never fires                           | Check the event and the `matcher`. Claude Code logs which hooks matched and their exit codes — run with `--debug`                 |
| "The clause is too fuzzy to enforce"           | That _is_ the finding. Enforce the mechanical core, document the rest, and note plainly that fuzzy policy is unenforceable policy |
| Tempted to block everything                    | Ask what happens the first time it fires on legitimate work. You'll be the reason someone disables hooks                          |
| The CI gate fails on a docs-only PR            | Expected. Now decide: path filter, warn instead of fail, or accept it. That decision is the deliverable                           |
| `git diff` fails in CI with "unknown revision" | `fetch-depth: 0` on the checkout step                                                                                             |

## Last topic: how does a standard reach every repo?

You have one governance artifact in one repo. You have more than one repo, and none of them
have any of this today. We'll work through it as a group — crawl, walk, run:

|           | Move                                                                                                                                                                                                                                                                | Cost    | What it can't do                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| **Crawl** | One `sdlc-governance` repo. Two lines in each project's CLAUDE.md: where it lives, and "before X, read Y"                                                                                                                                                           | ~30 min | Nothing is local, nothing enforced, nobody knows if they're current |
| **Walk**  | Make it **queryable** — `semble search "<rule>" <governance-repo-url> --content docs` — and **pinnable** — pull a tagged copy, write the tag to a `VERSION` file, have a pre-commit hook _verify_ the pin                                                           | 1–2 hrs | Still no enforcement; N copies to keep in step                      |
| **Run**   | Guardrails ship as a **versioned Claude Code plugin** from a private marketplace, so a new deny rule reaches everyone on their next session. Docs get served rather than copied. CI gates enforce the mechanical clauses. New repos start from a compliant template | ~days   | Needs someone to own it                                             |

Note how you received _this_ handout: one canonical repo, a pointer, and a copy-paste — or
`giget`, if you used it. That's crawl and walk, and you just ran them.

Two rules that hold at every rung: **a pre-commit hook verifies the pin, it never fetches**
(network on every commit breaks offline work and mutates the tree mid-commit), and **whatever
you can't enforce, you write down** — including who accepted the risk.

**The discussion has to end in a decision.** Not a preference — a rung, a first move, and a
person. Crawl is roughly thirty minutes of one person's afternoon, so "we'll decide later"
is the only answer that costs more than doing it. A rung with no owner is a rung nobody is on.

## Where this goes next

Two things leave this room and continue outside it:

- **Port one artifact to a real repo.** Pick the smallest thing that transfers — usually the
  deny/ask list, sometimes an NFR — and land it in a repo you actually ship from. Office hours
  is for this; bring the repo, not a question. This is the step that decides whether Lab 2
  produced a standard or a training exercise.
- **Apply the pattern to a convention that's yours.**
  [`enforcing-a-convention.md`](../best-practices/enforcing-a-convention.md) is the takeaway
  card — it works the whole shape through on stored procedures, including the false positives
  and the clauses no gate can decide. Independent follow-up, supported in office hours.

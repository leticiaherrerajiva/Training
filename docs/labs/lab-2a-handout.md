# Lab 2.a — Writing the Standards Down

**Skill:** authoring the governance documents an AI agent actually uses — and deciding when each one is warranted.
**Duration:** ~2 hours, facilitated.
**Surface:** your own copy of this repo.

---

## Why this block exists

Last week you fixed real bugs with Claude, test-first. It worked because this repo already
told Claude how it works — the stack, the conventions, the commands, where things live.

You have sixteen developers and, right now, sixteen private versions of that context. The
habits are good and none of them are shared. This block turns habits into standards: written
down, reviewed, and pointed at from the one file that is always in context.

One finding worth knowing before you start: an ETH Zurich study published in February 2026 found
that **LLM-generated context files made task success slightly worse** than providing no context at
all (about −3%), while raising cost by more than 20%. Human-written files improved success (about
+4%). Running `/init` and walking away is worse than doing nothing. You will use Claude to draft —
from evidence in the code — and you will own the decisions.

## Before the session

- [ ] Your copy of this repo runs: `npm install`, `npm run reset-db`, `npm run dev`, `npm test` green
- [ ] Your Lab 1.b PR link handy — we're going to look at real fixes from last week, possibly yours
- [ ] Skim `docs/adr/0001-shared-api-response-envelope.md` and `docs/nfr/0001-external-api-error-handling.md` — one worked example of each form ships in this repo
- [ ] Optional, keeps the `Closes #N` habit from Lab 1: seed the Lab 2 backlog into your copy

```bash
bash docs/labs/snippets/seed-lab2-issues.sh
```

> Your copy was made from the template before these lab materials existed, and template
> copies don't inherit later changes. That is why things arrive as snippets you paste rather
> than files already in your repo — and it's a preview of Lab 2.b's last topic: how a standard
> travels to repos that already exist.

To pull this whole folder into your copy instead of copying files one at a time:

```bash
npx giget gh:mike-tajmajer-fullstacklabs/fsl-taskboard-lab/docs/labs docs/labs
```

## The five artifact types

Each one answers a **different question**. That's the cleanest way to keep them apart — if you
can name the question, you know which document you're writing.

| Artifact                          | The question it answers                              | What it is                       |
| --------------------------------- | ---------------------------------------------------- | -------------------------------- |
| **CLAUDE.md**                     | "What must the agent know before anything else?"     | Always-loaded context + pointers |
| **ADR**                           | "**Why** is it like this?"                           | One decision, with its cost      |
| **NFR**                           | "**What must always be true**, and how do we check?" | A standing, testable rule        |
| **Best-practice recipe**          | "**How** do I do X here?"                            | A worked procedure               |
| **Rules file** (`.claude/rules/`) | "What applies **only** when touching these files?"   | Path-scoped context              |

### One subject, five artifacts

This repo has a real rule: **only `server/src/repositories/` may import `db/store.ts`.** Here is
what each artifact says about that same subject — and notice that none of them is redundant:

| Artifact          | What it says about the boundary                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| **CLAUDE.md**     | One line, no rationale: `Don't: access db.json outside server/src/repositories/`. Always loaded |
| **ADR**           | Why a repository layer was chosen, what else was considered, and what it costs. Written once    |
| **NFR**           | The rule as a standing requirement — **plus how compliance is checked**                         |
| **Best practice** | `adding-a-resource.md` — the steps for adding a resource _within_ that boundary                 |
| **Rules file**    | Guidance that loads only when you're in the files it applies to                                 |

The ADR is **history** — why we chose this, once, and what we gave up. The NFR is **law** —
what must hold now, and how you'd know. The recipe is **procedure**. CLAUDE.md is the
**index**. The rules file is **context that arrives just in time**.

### Telling them apart when it's genuinely unclear

All five, on the axes that actually differ:

|                      | CLAUDE.md               | Rules file                          | ADR                          | NFR                        | Recipe                   |
| -------------------- | ----------------------- | ----------------------------------- | ---------------------------- | -------------------------- | ------------------------ |
| **Answers**          | What to know first      | What applies _here_                 | **Why**                      | What must hold             | **How**                  |
| **Tense**            | Present, standing       | Present, scoped                     | Past — a choice made         | Present — holds now        | Imperative               |
| **Lifecycle**        | Revised continuously    | Revised in place                    | **Superseded**, never edited | Revised in place           | Updated freely           |
| **Carries a check?** | No                      | No                                  | No                           | **Yes — that's why**       | No                       |
| **When it loads**    | **Always**              | When you touch matching paths       | On demand, via a trigger     | On demand + a binding line | On demand, via a trigger |
| **Lose it and…**     | The agent is unoriented | Guidance stops arriving when needed | You lose the _why_           | You lose the _rule_        | You lose the _how_       |

Two rows do most of the work. **Carries a check?** separates the NFR from everything else — it is
the only artifact that obliges you to say how compliance is verified, which is why it's the one
that leads into guardrails. **When it loads** separates the two context files from the three
documents: CLAUDE.md is always there and therefore expensive, a rules file arrives only where it
applies, and everything else waits to be fetched.

**Quick test.** One-time choice → ADR. Must always hold and you can say how it's checked →
NFR. Steps someone follows → recipe. Needed every session → CLAUDE.md. Only relevant in some
files → rules file.

### One home per fact

The failure mode is writing the same content into all five. Then they drift, and nobody knows
which one is authoritative. **Each fact lives in exactly one place; the others point at it.**
That is why CLAUDE.md has a trigger table instead of the docs' contents.

The scope hierarchy is worth holding onto too: **Collective** (org-wide) → **Project** (this
repo) → **Feature** (this slice). Most teams have none of the first and an accident of the second.

## What you'll do

### 1. Watch one ADR get written

Your instructor documents the repository-pattern boundary live: the gap, the evidence in the
code, Claude drafting the Context, a human owning the Decision, commit.

**Checkpoint:** you have an ADR staged in `docs/adr/` with the Status/Date/Deciders block completed
and all three sections — Context, Decision, Consequences — filled.

### 2. Derive a rule from real code

We put three real fixes from last week on screen. You read them cold and answer one question:

> **Which of these are acceptable? Write the rule.**

Your group produces a list of candidate clauses. For each one, tag it:

- **mechanical** — a script could decide this from the code or the diff
- **fuzzy** — it needs a person

That tag is the whole point. Do not skip it, and do not resolve the disagreements
prematurely — where the room disagrees is where the standard is actually being made.

### 3. Write it up as an NFR

Turn the agreed clauses into a doc in `docs/nfr/`, copying the shape of NFR-0001. Every
clause states **how compliance is checked**. Clauses that can't be checked get a recorded
decision: accepted risk, human gate, or dropped.

**Checkpoint:** your NFR names how each clause is checked — and which ones can't be.

### 4. Wire both docs into CLAUDE.md

A doc nothing points at is a doc nobody reads, Claude included. Add a row to the
"Reference docs — read on demand" table for each new doc, phrased as a situation the reader
is _in_ ("Changing X → read Y"), plus one binding line for the NFR so it applies without
being fetched.

Then **smoke-test it**: start a fresh session, ask Claude the rule, and confirm it reads
your doc rather than guessing.

## Prompt starters

Swap in your own paths. Note what each one does _not_ do: none of them ask Claude to decide.

| Step                   | Prompt                                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gather evidence        | `Read @server/src/repositories/ and @server/src/services/todos.service.ts. What boundary do these files enforce, and what would break if it were violated? Don't propose changes.`        |
| Draft an ADR           | `Using @docs/adr/template.md, draft an ADR for that boundary. Fill Context and Consequences from what you just read. Leave Decision as a question for me to answer.`                      |
| Pressure-test a clause | `Here is a draft rule: "<clause>". Could a script decide whether a change complies, using only the diff? If not, say exactly what a human has to judge.`                                  |
| Draft an NFR           | `Using @docs/nfr/0001-external-api-error-handling.md as the form, turn these clauses into an NFR. For each clause add how compliance is checked. Mark any you cannot express as a check.` |
| Wire it in             | `Add a row to the reference-docs table in @CLAUDE.md for @docs/nfr/<file>.md. Phrase the trigger as a situation, matching the existing rows.`                                             |

## Acceptance criteria

- [ ] One **ADR** committed in `docs/adr/`, following the template, with at least one honest cost in Consequences
- [ ] One **NFR** committed in `docs/nfr/`, every clause stating how it is checked
- [ ] Clauses that can't be mechanically checked are **marked**, each with a recorded decision
- [ ] Both docs **wired into CLAUDE.md** — trigger-table rows plus one binding line — and smoke-tested in a fresh session
- [ ] Everything reviewed by a teammate via PR, CI green

## Stretch

- Derive clauses for the second convention as well
- Convert a prose rule into a path-scoped `.claude/rules/` file, following `testing.md`
- Review a peer's ADR against the fuller MADR fields: Decision Drivers, Considered Options
- Get a head start on the "how we use these" README — when each artifact is warranted, who authors it, who reviews it, where it lives. It's a required deliverable in 2.b, and today's session is when you know the answers

## Common stuck points

| Symptom                                            | What to do                                                                                                            |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "I don't know what decision to write an ADR about" | Use the trigger: hard to reverse, contested, or a newcomer would ask why. The store boundary qualifies on all three   |
| The NFR reads like a wish                          | If you can't say how it's checked, it isn't an NFR yet. Write the check first, then work backwards to the wording     |
| Claude wrote the whole doc and it looks fine       | Read it as someone who disagrees. If there's nothing to disagree with, it's a description, not a decision             |
| The group can't agree on a clause                  | Good. Write both versions down and say which one you shipped and why — that sentence is more valuable than the clause |
| "This rule can't be enforced, so why write it?"    | Unenforceable rules still coordinate people. What they must not do is _pretend_ to be enforced — hence the marking    |

## Where this goes next

Lab 2.b takes the clause you derived and makes something refuse to violate it — then asks the
harder question: how does a standard reach every repo you already have?

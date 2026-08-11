# Lab handouts

Student-facing material for the Lab 2 blocks. Read the handout for the block you're in.

| Block   | Handout                                                      | You'll produce                                                   |
| ------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| **2.a** | [Writing the Standards Down](lab-2a-handout.md)              | An ADR, an NFR, both wired into CLAUDE.md                        |
| **2.b** | [Guardrails, and Making Standards Travel](lab-2b-handout.md) | A verified guardrail, a documented bypass, a decision per clause |

Snippets to paste into your own copy live in [`snippets/`](snippets/):

| File                  | Used in | What it is                                                                   |
| --------------------- | ------- | ---------------------------------------------------------------------------- |
| `hook-skeleton.js`    | 2.b     | Hook plumbing — block and nudge shapes, one throwaway rule. Replace the rule |
| `governance-gate.yml` | 2.b     | CI gate plumbing, including the `fetch-depth: 0` gotcha                      |
| `seed-lab2-issues.sh` | 2.a     | Optional — seeds the Lab 2 backlog into your copy so `Closes #N` still works |

## Why these are snippets and not files in your repo

Your copy was created from the template **before** these materials existed, and template copies
don't inherit later upstream changes. So the canonical copy lives here and you pull what you
need into your own repo.

Copy-paste from GitHub's raw view works. Or pull the whole folder:

```bash
npx giget gh:mike-tajmajer-fullstacklabs/fsl-taskboard-lab/docs/labs docs/labs
```

That is not incidental — it's the first two rungs of the distribution ladder Lab 2.b ends on. One
canonical repo plus a pointer is _crawl_; pulling a pinned copy on demand is _walk_. You're using
the thing you're about to be taught.

## Also worth reading

- [`../best-practices/enforcing-a-convention.md`](../best-practices/enforcing-a-convention.md) — takeaway card for applying the guardrail pattern in your own codebase, on your own conventions. Independent follow-up, supported in office hours.

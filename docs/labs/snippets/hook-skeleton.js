#!/usr/bin/env node
/**
 * Lab 2.b — hook skeleton. Copy this into YOUR copy of the repo as
 * `.claude/hooks/check-convention.js`, then replace the example rules with
 * the clause your group derived in Lab 2.a.
 *
 * This file gives you the plumbing. The policy is yours to write.
 *
 * ── The contract ────────────────────────────────────────────────────────
 * A hook reads the tool call as JSON on stdin. What your exit code means
 * depends on WHICH event you registered it for:
 *
 *   PreToolUse  + exit 2  → BLOCKS the tool call. stderr is shown to Claude.
 *   PostToolUse + exit 2  → cannot block (the tool already ran), but stderr
 *                           is still shown to Claude → a NUDGE.
 *   any event   + exit 0  → allow, say nothing.
 *   any other non-zero    → non-blocking; the user sees a "hook error" notice.
 *
 * That difference IS the block-vs-warn decision. Pick per rule, on purpose.
 *
 * Register it in `.claude/settings.json` under the event you want:
 *
 *   "hooks": {
 *     "PreToolUse":  [{ "matcher": "Edit|Write",
 *       "hooks": [{ "type": "command",
 *         "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/check-convention.js\"" }] }]
 *   }
 *
 * Node only — no shell, no dependencies. Half the cohort is on Windows.
 * Docs: https://code.claude.com/docs/en/hooks
 */

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  let body = '';
  try {
    const payload = JSON.parse(raw);
    filePath = payload.tool_input?.file_path ?? '';
    // Write sends `content`; Edit sends `new_string`.
    body = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';
  } catch {
    process.exit(0); // Unparseable payload — never block unrelated work.
  }

  const path = filePath.replaceAll('\\', '/'); // Windows-safe comparisons.

  // ─── REPLACE EVERYTHING BELOW WITH YOUR RULE ──────────────────────────
  // Two throwaway examples, only here to show the two shapes.

  // BLOCK example — register on PreToolUse. Unambiguous and unrecoverable.
  // Matches this repo's `package-lock.json` as well as `*.lock` files generally,
  // so you can actually exercise it: ask Claude to edit package-lock.json.
  if (/(^|\/)package-lock\.json$|\.lock$/.test(path)) {
    return deny(
      'BLOCKED: lock files are generated, not edited by hand.',
      'Why: hand-editing a lock file produces installs nobody else can reproduce.',
      'Instead: change the dependency, then let the package manager regenerate it.',
      'Done means: the lock file only ever changes as a result of an install.',
    );
  }

  // NUDGE example — register on PostToolUse. Heuristic, so don't block on it.
  if (/\bTODO\b/.test(body)) {
    return nudge(
      'NOTE: this change adds a TODO.',
      'Why: TODOs in committed code are invisible work.',
      'Instead: open an issue and reference it, or finish the thought now.',
    );
  }

  // ─── END OF THE PART YOU REPLACE ──────────────────────────────────────

  process.exit(0);
});

/** Refuse the action. Only has teeth on PreToolUse. */
function deny(...lines) {
  console.error(lines.join('\n'));
  process.exit(2);
}

/** Let it through, but tell Claude. Use on PostToolUse. */
function nudge(...lines) {
  console.error(lines.join('\n'));
  process.exit(2); // On PostToolUse this informs without blocking.
}

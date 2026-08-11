#!/usr/bin/env node
/**
 * PreToolUse guardrail: blocks Edit/Write calls that target the canonical
 * seed data. Part of a defense-in-depth trio with the permissions.deny rule
 * in .claude/settings.json and the "Critical rules" section of CLAUDE.md.
 *
 * Hook contract: read the tool call as JSON on stdin; exit 0 to allow,
 * exit 2 to block (stderr is fed back to the model).
 */

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    const payload = JSON.parse(raw);
    filePath = payload.tool_input?.file_path ?? '';
  } catch {
    process.exit(0); // Unparseable payload — don't block unrelated work.
  }

  const normalized = filePath.replaceAll('\\', '/');
  if (normalized.endsWith('server/data/seed.json')) {
    console.error(
      [
        'BLOCKED: Modifying server/data/seed.json is not allowed.',
        'Why: it is the canonical reset baseline every student and lab depends on.',
        'Instead: change runtime data through the API or server/data/db.json, then run `npm run reset-db`; propose seed changes via a PR flagged to the instructor.',
        'Done means: seed.json has no diff and your data change is reproducible after a reset.',
      ].join('\n'),
    );
    process.exit(2);
  }

  process.exit(0);
});

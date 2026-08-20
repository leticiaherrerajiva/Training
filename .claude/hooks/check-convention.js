#!/usr/bin/env node
/**
 * Lab 2.b — enforces CLAUDE.md's testing approach: "Vitest, co-located with
 * the module under test (x.service.ts -> x.service.test.ts)". Scoped to
 * services/ and routes/, where CLAUDE.md explicitly expects coverage —
 * config/schema/lib files are excluded to keep the nudge meaningful.
 *
 * PostToolUse nudge: this is a heuristic (a test can exist under a different
 * name, or genuinely not be needed yet), so it informs instead of blocking.
 */
import fs from 'node:fs';

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    filePath = JSON.parse(raw).tool_input?.file_path ?? '';
  } catch {
    process.exit(0); // Unparseable payload — never block unrelated work.
  }

  const path = filePath.replaceAll('\\', '/'); // Windows-safe comparisons.

  if (
    /(^|\/)server\/src\/(services|routes)\/[^/]+\.ts$/.test(path) &&
    !path.endsWith('.test.ts')
  ) {
    const testPath = path.replace(/\.ts$/, '.test.ts');
    if (!fs.existsSync(testPath)) {
      return nudge(
        `NOTE: ${path} has no sibling test.`,
        'Why: CLAUDE.md\'s testing approach co-locates Vitest tests with the module under test.',
        `Instead: add ${testPath} covering this change, or note why it genuinely needs none.`,
      );
    }
  }

  process.exit(0);
});

/** Let it through, but tell Claude. Use on PostToolUse. */
function nudge(...lines) {
  console.error(lines.join('\n'));
  process.exit(2); // On PostToolUse this informs without blocking.
}

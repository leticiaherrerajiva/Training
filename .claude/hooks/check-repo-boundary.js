#!/usr/bin/env node
/**
 * Enforces CLAUDE.md's architecture rule: "server/src/repositories/ — the
 * ONLY layer allowed to import server/src/db/store.ts". Unambiguous and
 * mechanical, so this registers on PreToolUse and blocks.
 *
 * Two known, legitimate exceptions carved out below: server/src/index.ts
 * (the composition root — it must call ensureDb() at startup) and
 * type-only imports anywhere (e.g. `import type { Db } from '../db/store'`
 * in testing/helpers.ts) — neither creates the runtime coupling this rule
 * exists to prevent.
 */

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  let body = '';
  try {
    const payload = JSON.parse(raw);
    filePath = payload.tool_input?.file_path ?? '';
    body = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';
  } catch {
    process.exit(0); // Unparseable payload — never block unrelated work.
  }

  const path = filePath.replaceAll('\\', '/'); // Windows-safe comparisons.

  const isRepositoryFile = /(^|\/)server\/src\/repositories\//.test(path);
  const isCompositionRoot = /(^|\/)server\/src\/index\.ts$/.test(path);

  if (isRepositoryFile || isCompositionRoot) {
    process.exit(0);
  }

  const importsDbStoreByValue =
    /^\s*import\s+(?!type\b)[^;]*from\s+['"][^'"]*\/db\/store['"]/m.test(body);

  if (importsDbStoreByValue) {
    console.error(
      [
        'BLOCKED: only server/src/repositories/ may import db/store.ts.',
        "Why: CLAUDE.md's architecture rule keeps persistence behind the repository layer — a route or service importing db/store directly breaks that boundary.",
        'Instead: add or use a method on the relevant repository instead of reading/writing the store here.',
        'Done means: this file has no value import of db/store; only a repository (or the composition root) touches it.',
      ].join('\n'),
    );
    process.exit(2); // PreToolUse -> blocks
  }

  process.exit(0);
});

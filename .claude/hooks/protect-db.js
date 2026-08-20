#!/usr/bin/env node
let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    filePath = JSON.parse(raw).tool_input?.file_path ?? '';
  } catch {
    process.exit(0); // unparseable — never block unrelated work
  }
  const path = filePath.replaceAll('\\', '/'); // Windows-safe

  if (path.endsWith('server/data/db.json')) {
    console.error(
      [
        'BLOCKED: db.json is generated, not edited.',
        'Why: hand-edits are lost on the next reset and are invisible to everyone else.',
        'Instead: change data through the API, or edit seed.json via PR and run npm run reset-db.',
        'Done means: your data change survives a reset.',
      ].join('\n'),
    );
    process.exit(2); // PreToolUse -> blocks
  }
  process.exit(0);
});

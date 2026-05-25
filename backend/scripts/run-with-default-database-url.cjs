const { spawnSync } = require('node:child_process');

const defaultDatabaseUrl = process.env.VERCEL
  ? 'file:/tmp/data.sqlite'
  : 'file:./data.sqlite';

process.env.DATABASE_URL ||= defaultDatabaseUrl;

const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Expected a command to run.');
  process.exit(1);
}

const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);

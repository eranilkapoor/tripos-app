import { spawnSync } from 'node:child_process';

const result = spawnSync(
  'npm',
  ['--prefix', 'tripos-api-server', 'run', 'contracts:generate-spec'],
  { stdio: 'inherit', shell: process.platform === 'win32' },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

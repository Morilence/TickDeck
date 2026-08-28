import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '../..');
const serverPortArgument = process.argv.indexOf('--server-port');
const configuredServerPort =
  serverPortArgument >= 0 ? process.argv[serverPortArgument + 1] : process.env.TICKDECK_SERVER_PORT;
const serverPort = Number(configuredServerPort ?? '4173');
if (!Number.isSafeInteger(serverPort) || serverPort < 1 || serverPort > 65_535) {
  throw new Error('SERVER_PORT_INVALID');
}

async function reservePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('PORT_RESERVATION_FAILED');
  const { port } = address;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

for (const artifact of [
  'apps/worker/dist/index.js',
  'apps/server/dist/index.js',
  'apps/web/dist/index.html',
]) {
  await access(path.join(root, artifact));
}

const workerPort = await reservePort();
const workerToken = randomBytes(32).toString('base64url');
const commonEnvironment = {
  ...process.env,
  NODE_ENV: 'production',
};

const worker = spawn(process.execPath, ['apps/worker/dist/index.js'], {
  cwd: root,
  env: { ...commonEnvironment, TICKDECK_WORKER_PORT: String(workerPort) },
  stdio: ['pipe', 'pipe', 'inherit'],
});
const server = spawn(process.execPath, ['apps/server/dist/index.js'], {
  cwd: root,
  env: {
    ...commonEnvironment,
    TICKDECK_SERVER_HOST: '127.0.0.1',
    TICKDECK_SERVER_PORT: String(serverPort),
    TICKDECK_WORKER_URL: `http://127.0.0.1:${workerPort}`,
  },
  stdio: ['pipe', 'pipe', 'inherit'],
});

worker.stdin.end(workerToken);
server.stdin.end(workerToken);

worker.stdout.pipe(process.stdout);
server.stdout.pipe(process.stdout);

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  worker.kill('SIGTERM');
  server.kill('SIGTERM');
  process.exitCode = exitCode;
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stop());
}
worker.once('exit', (code) => stop(code ?? 1));
server.once('exit', (code) => stop(code ?? 1));

process.stdin.resume();

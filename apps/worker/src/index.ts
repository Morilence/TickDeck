import { structuralSeed as agentSeed } from '@tickdeck/agent-mastra';
import { structuralSeed as brokerSeed } from '@tickdeck/connectors-core';
import { structuralSeed as officialSeed } from '@tickdeck/connectors-official';
import { capabilitySlices, catalogDigest, validateWorkerCredential } from '@tickdeck/contracts';
import { structuralSeed as coreSeed } from '@tickdeck/core';
import { structuralSeed as modelsSeed } from '@tickdeck/models';
import { structuralSeed as notificationsSeed } from '@tickdeck/notifications';
import { structuralSeed as policiesSeed } from '@tickdeck/policies';
import { timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';

export const workerStructuralDependencies = [
  agentSeed,
  brokerSeed,
  officialSeed,
  coreSeed,
  modelsSeed,
  notificationsSeed,
  policiesSeed,
] as const;

const defaultProtocolVersion = 'tickdeck-local-health-v1';

function tokenMatches(received: string | undefined, expected: string): boolean {
  if (!received?.startsWith('Bearer ')) return false;
  const candidate = Buffer.from(received.slice('Bearer '.length));
  const reference = Buffer.from(expected);
  return candidate.length === reference.length && timingSafeEqual(candidate, reference);
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export type WorkerServerOptions = Readonly<{
  token: string;
  host?: string;
  port?: number;
  protocolVersion?: string;
  buildCatalogDigest?: string;
}>;

export async function readWorkerCredential(
  input: AsyncIterable<Uint8Array | string> = process.stdin,
): Promise<string> {
  const chunks: Buffer[] = [];
  let byteLength = 0;
  for await (const chunk of input) {
    const bytes = typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : Buffer.from(chunk);
    byteLength += bytes.length;
    if (byteLength > 256) throw new TypeError('WORKER_CREDENTIAL_INVALID');
    chunks.push(bytes);
  }
  return validateWorkerCredential(Buffer.concat(chunks).toString('utf8'));
}

export async function startWorkerHealthServer(options: WorkerServerOptions) {
  validateWorkerCredential(options.token);
  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    if (request.method !== 'GET' || request.url !== '/tickdeck-rpc/v1/handshake') {
      sendJson(response, 404, { code: 'WORKER_HANDLER_NOT_REGISTERED', parameters: {} });
      return;
    }
    if (!tokenMatches(request.headers.authorization, options.token)) {
      sendJson(response, 401, { code: 'WORKER_AUTH_REJECTED', parameters: {} });
      return;
    }
    sendJson(response, 200, {
      role: 'worker',
      status: 'ready',
      protocolVersion: options.protocolVersion ?? defaultProtocolVersion,
      buildCatalogDigest: options.buildCatalogDigest ?? catalogDigest,
      surfaceIds: capabilitySlices.worker.surfaceIds,
      businessHandlerCount: 0,
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 0, options.host ?? '127.0.0.1', resolve);
  });
  const address = server.address();
  if (address === null || typeof address === 'string')
    throw new Error('WORKER_ADDRESS_UNAVAILABLE');
  return {
    host: options.host ?? '127.0.0.1',
    port: address.port,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}

async function runCli(): Promise<void> {
  const token = await readWorkerCredential();
  const handle = await startWorkerHealthServer({
    token,
    port: Number(process.env.TICKDECK_WORKER_PORT ?? '43111'),
  });
  process.stdout.write(
    `${JSON.stringify({ code: 'WORKER_READY', host: handle.host, port: handle.port })}\n`,
  );
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  runCli().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : 'WORKER_START_FAILED'}\n`);
    process.exitCode = 1;
  });
}

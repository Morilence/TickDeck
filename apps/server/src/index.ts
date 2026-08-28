import fastifyStatic from '@fastify/static';
import { structuralSeed as artifactSeed } from '@tickdeck/artifact-fs';
import {
  capabilitySlices,
  catalogDigest,
  releaseManifest,
  validateCapabilitySlices,
  validateWorkerCredential,
  type HealthSnapshot,
  type WorkerHandshake,
} from '@tickdeck/contracts';
import { structuralSeed as coreSeed } from '@tickdeck/core';
import { structuralSeed as policiesSeed } from '@tickdeck/policies';
import { structuralSeed as storageSeed } from '@tickdeck/storage-sqlite';
import Fastify from 'fastify';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const serverStructuralDependencies = [
  artifactSeed,
  coreSeed,
  policiesSeed,
  storageSeed,
] as const;

export type WorkerHealthCode = HealthSnapshot['worker']['code'];
export type WorkerProbe = () => Promise<WorkerHealthCode>;

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

export function normalizeLoopbackWorkerUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError('TICKDECK_WORKER_URL_INVALID');
  }
  const hostname = parsed.hostname.replace(/^\[|\]$/gu, '').toLowerCase();
  const isLoopback =
    hostname === 'localhost' || hostname === '::1' || /^127(?:\.\d{1,3}){3}$/u.test(hostname);
  if (
    parsed.protocol !== 'http:' ||
    parsed.username.length > 0 ||
    parsed.password.length > 0 ||
    parsed.pathname !== '/' ||
    parsed.search.length > 0 ||
    parsed.hash.length > 0 ||
    !isLoopback
  ) {
    throw new TypeError('TICKDECK_WORKER_URL_INVALID');
  }
  return parsed.origin;
}

export async function probeWorker(
  workerUrl: string,
  token: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<WorkerHealthCode> {
  let endpoint: string;
  try {
    endpoint = `${normalizeLoopbackWorkerUrl(workerUrl)}/tickdeck-rpc/v1/handshake`;
  } catch {
    return 'WORKER_UNAVAILABLE';
  }
  let response: Response;
  try {
    response = await fetchImplementation(endpoint, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(2_000),
    });
  } catch {
    return 'WORKER_UNAVAILABLE';
  }
  if (response.status === 401) return 'WORKER_AUTH_REJECTED';
  if (!response.ok) return 'WORKER_UNAVAILABLE';
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return 'WORKER_PROTOCOL_MISMATCH';
  }
  if (typeof body !== 'object' || body === null) return 'WORKER_PROTOCOL_MISMATCH';
  const payload = body as Partial<WorkerHandshake>;
  if (
    payload.role !== 'worker' ||
    payload.status !== 'ready' ||
    payload.protocolVersion !== 'tickdeck-local-health-v1' ||
    payload.businessHandlerCount !== 0 ||
    !Array.isArray(payload.surfaceIds) ||
    JSON.stringify(payload.surfaceIds) !== JSON.stringify(capabilitySlices.worker.surfaceIds)
  ) {
    return 'WORKER_PROTOCOL_MISMATCH';
  }
  if (payload.buildCatalogDigest !== catalogDigest) return 'WORKER_CATALOG_MISMATCH';
  return 'WORKER_HEALTHY';
}

export type TickDeckServerOptions = Readonly<{
  serveWeb?: boolean;
  webRoot?: string;
  workerProbe: WorkerProbe;
}>;

export async function createTickDeckServer(options: TickDeckServerOptions) {
  const app = Fastify({ logger: false });

  if (options.serveWeb !== false) {
    const webRoot = options.webRoot ?? fileURLToPath(new URL('../../web/dist/', import.meta.url));
    await app.register(fastifyStatic, { root: webRoot, wildcard: false });
  }

  app.get('/api/v1/health', async (_request, reply) => {
    const workerCode = await options.workerProbe().catch(() => 'WORKER_UNAVAILABLE' as const);
    const healthy = workerCode === 'WORKER_HEALTHY';
    const snapshot: HealthSnapshot = {
      schemaVersion: '1.0.0',
      code: healthy ? 'TICKDECK_HEALTHY' : 'TICKDECK_DEGRADED',
      stage: 'S0-V',
      catalogDigest,
      worker: { code: workerCode },
    };
    return reply.code(healthy ? 200 : 503).send(snapshot);
  });

  app.get('/api/v1/capability-manifest', async (_request, reply) => {
    const errors = validateCapabilitySlices(releaseManifest.slices);
    if (errors.length > 0) {
      return reply.code(500).send({ code: 'CAPABILITY_SLICE_DRIFT', parameters: { errors } });
    }
    return reply.send(releaseManifest);
  });

  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      return reply.code(404).send({ code: 'API_ROUTE_NOT_FOUND', parameters: {} });
    }
    if (options.serveWeb === false) {
      return reply.code(404).send({ code: 'WEB_SHELL_DISABLED', parameters: {} });
    }
    return reply.type('text/html').sendFile('index.html');
  });

  await app.ready();
  return app;
}

async function runCli(): Promise<void> {
  const token = await readWorkerCredential();
  const workerUrl = normalizeLoopbackWorkerUrl(
    process.env.TICKDECK_WORKER_URL ?? 'http://127.0.0.1:43111',
  );
  const app = await createTickDeckServer({ workerProbe: () => probeWorker(workerUrl, token) });
  const host = process.env.TICKDECK_SERVER_HOST ?? '127.0.0.1';
  const port = Number(process.env.TICKDECK_SERVER_PORT ?? '4173');
  await app.listen({ host, port });
  process.stdout.write(`${JSON.stringify({ code: 'SERVER_READY', host, port })}\n`);
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(path.resolve(entry)).href) {
  runCli().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : 'SERVER_START_FAILED'}\n`);
    process.exitCode = 1;
  });
}

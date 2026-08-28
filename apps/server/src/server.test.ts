import { capabilitySlices, catalogDigest } from '@tickdeck/contracts';
import { upstreamSeeds } from '@tickdeck/testkit';
import { Readable } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';

import {
  createTickDeckServer,
  normalizeLoopbackWorkerUrl,
  probeWorker,
  readWorkerCredential,
} from './index.js';

describe('Fastify same-origin control shell', () => {
  it('accepts the Worker credential only through the bounded inherited stream contract', async () => {
    await expect(readWorkerCredential(Readable.from(['test-worker-token-0000']))).resolves.toBe(
      'test-worker-token-0000',
    );
    await expect(readWorkerCredential(Readable.from(['not valid secret']))).rejects.toThrow(
      'WORKER_CREDENTIAL_INVALID',
    );
  });

  it('returns versioned health and the canonical release projection', async () => {
    const app = await createTickDeckServer({
      serveWeb: false,
      workerProbe: () => Promise.resolve('WORKER_HEALTHY'),
    });
    const health = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(health.statusCode).toBe(200);
    expect(health.json()).toEqual({
      schemaVersion: '1.0.0',
      code: 'TICKDECK_HEALTHY',
      stage: 'S0-V',
      catalogDigest,
      worker: { code: 'WORKER_HEALTHY' },
    });
    const manifest = await app.inject({ method: 'GET', url: '/api/v1/capability-manifest' });
    expect(manifest.statusCode).toBe(200);
    expect(manifest.json()).not.toHaveProperty('slices.web.surfaceIds.3');
    expect(upstreamSeeds).toHaveLength(3);
    await app.close();
  });

  it('fails health closed when the Worker is unavailable', async () => {
    const app = await createTickDeckServer({
      serveWeb: false,
      workerProbe: () => Promise.resolve('WORKER_UNAVAILABLE'),
    });
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      code: 'TICKDECK_DEGRADED',
      worker: { code: 'WORKER_UNAVAILABLE' },
    });
    await app.close();
  });

  it('maps a rejected Worker probe to a versioned degraded 503', async () => {
    const app = await createTickDeckServer({
      serveWeb: false,
      workerProbe: () => Promise.reject(new Error('controlled probe rejection')),
    });
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      schemaVersion: '1.0.0',
      code: 'TICKDECK_DEGRADED',
      stage: 'S0-V',
      catalogDigest,
      worker: { code: 'WORKER_UNAVAILABLE' },
    });
    await app.close();
  });
});

describe('Worker handshake fail-closed classifications', () => {
  function response(body: unknown, status = 200): Promise<Response> {
    return Promise.resolve(new Response(JSON.stringify(body), { status }));
  }

  const validHandshake = {
    role: 'worker',
    status: 'ready',
    protocolVersion: 'tickdeck-local-health-v1',
    businessHandlerCount: 0,
    buildCatalogDigest: catalogDigest,
    surfaceIds: capabilitySlices.worker.surfaceIds,
  } as const;

  it.each([
    [401, {}, 'WORKER_AUTH_REJECTED'],
    [200, { role: 'wrong' }, 'WORKER_PROTOCOL_MISMATCH'],
    [200, { ...validHandshake, surfaceIds: [] }, 'WORKER_PROTOCOL_MISMATCH'],
    [
      200,
      { ...validHandshake, surfaceIds: ['runtime-health', 'runtime-health'] },
      'WORKER_PROTOCOL_MISMATCH',
    ],
    [
      200,
      {
        role: 'worker',
        status: 'ready',
        protocolVersion: 'tickdeck-local-health-v1',
        businessHandlerCount: 0,
        buildCatalogDigest: 'sha256:drift',
        surfaceIds: capabilitySlices.worker.surfaceIds,
      },
      'WORKER_CATALOG_MISMATCH',
    ],
  ])('maps status %s to %s', async (status, body, expected) => {
    const result = await probeWorker('http://127.0.0.1:43111', 'test-token', () =>
      response(body, status),
    );
    expect(result).toBe(expected);
  });

  it('classifies unreadable JSON as protocol mismatch', async () => {
    const result = await probeWorker('http://127.0.0.1:43111', 'test-token', () =>
      Promise.resolve(new Response('{not-json', { status: 200 })),
    );
    expect(result).toBe('WORKER_PROTOCOL_MISMATCH');
  });

  it('accepts only credential-free loopback HTTP before sending authorization', async () => {
    expect(normalizeLoopbackWorkerUrl('http://127.12.34.56:43111')).toBe(
      'http://127.12.34.56:43111',
    );
    expect(normalizeLoopbackWorkerUrl('http://[::1]:43111')).toBe('http://[::1]:43111');
    expect(normalizeLoopbackWorkerUrl('http://localhost:43111')).toBe('http://localhost:43111');
    for (const invalid of [
      'https://127.0.0.1:43111',
      'http://user:password@127.0.0.1:43111',
      'http://192.168.1.5:43111',
      'http://example.com:43111',
      'not-a-url',
    ]) {
      expect(() => normalizeLoopbackWorkerUrl(invalid)).toThrow('TICKDECK_WORKER_URL_INVALID');
    }

    const fetchSpy = vi.fn<typeof fetch>();
    expect(await probeWorker('https://example.com', 'must-not-leak', fetchSpy)).toBe(
      'WORKER_UNAVAILABLE',
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

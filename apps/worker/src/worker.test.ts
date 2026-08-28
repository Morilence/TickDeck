import { upstreamSeeds } from '@tickdeck/testkit';
import { Readable } from 'node:stream';
import { afterEach, describe, expect, it } from 'vitest';

import { readWorkerCredential, startWorkerHealthServer } from './index.js';

let close: (() => Promise<void>) | undefined;
afterEach(async () => close?.());

describe('authenticated worker health boundary', () => {
  it('accepts the credential only through the bounded inherited stream contract', async () => {
    await expect(readWorkerCredential(Readable.from(['test-worker-token-0000']))).resolves.toBe(
      'test-worker-token-0000',
    );
    await expect(readWorkerCredential(Readable.from(['not valid secret']))).rejects.toThrow(
      'WORKER_CREDENTIAL_INVALID',
    );
  });

  it('accepts the declared credential and exposes no business handler', async () => {
    const token = 'test-worker-token-0001';
    const handle = await startWorkerHealthServer({ token });
    close = handle.close;
    const base = `http://${handle.host}:${String(handle.port)}`;
    const healthy = await fetch(`${base}/tickdeck-rpc/v1/handshake`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(healthy.status).toBe(200);
    expect(await healthy.json()).toMatchObject({ businessHandlerCount: 0, status: 'ready' });
    const absent = await fetch(`${base}/tickdeck-rpc/v1/run`, {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(absent.status).toBe(404);
    expect(upstreamSeeds).toHaveLength(3);
  });

  it('fails closed for an invalid credential', async () => {
    const handle = await startWorkerHealthServer({ token: 'test-worker-token-0002' });
    close = handle.close;
    const response = await fetch(
      `http://${handle.host}:${String(handle.port)}/tickdeck-rpc/v1/handshake`,
      {
        headers: { authorization: 'Bearer wrong-credential' },
      },
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ code: 'WORKER_AUTH_REJECTED', parameters: {} });
  });
});

import { describe, expect, it } from 'vitest';

import {
  capabilitySlices,
  capabilityCatalog,
  catalogCanonicalJson,
  catalogDigest,
  catalogDigestDomain,
  releaseManifest,
  story11ExactCapabilityCatalog,
  validateCapabilitySlices,
  validateStory11ExactCatalog,
  validateWorkerCredential,
} from './index.js';
import { canonicalizeJson } from './canonical-json.js';

describe('canonical S0-V capability projection', () => {
  it('binds all slices and the release manifest to one catalog digest', () => {
    expect(catalogDigestDomain).toBe('tickdeck:capability-catalog:v1');
    expect(catalogCanonicalJson).toBe(canonicalizeJson(capabilityCatalog));
    expect(catalogDigest).toMatch(/^sha256:[a-f0-9]{64}$/u);
    expect(validateCapabilitySlices(capabilitySlices)).toEqual([]);
    expect(validateStory11ExactCatalog(capabilityCatalog)).toEqual([]);
    expect(story11ExactCapabilityCatalog).not.toBe(capabilityCatalog);
    expect(releaseManifest.catalogDigest).toBe(catalogDigest);
    expect(new Set(Object.values(capabilitySlices).map((slice) => slice.catalogDigest))).toEqual(
      new Set([catalogDigest]),
    );
  });

  it('canonicalizes JSON recursively with RFC 8785 key ordering and number rendering', () => {
    expect(canonicalizeJson({ z: -0, a: { '€': 1, '\r': 2, דּ: 3 } })).toBe(
      '{"a":{"\\r":2,"€":1,"דּ":3},"z":0}',
    );
    expect(() => canonicalizeJson({ invalid: Number.NaN })).toThrow(/finite/u);
    expect(() => canonicalizeJson({ invalid: undefined })).toThrow(/undefined/u);
    const sparseWithCompensatingKey = Array.from({ length: 2 }) as unknown[] & {
      extra?: string;
    };
    sparseWithCompensatingKey[1] = 'value';
    sparseWithCompensatingKey.extra = 'compensates-for-hole';
    expect(() => canonicalizeJson(sparseWithCompensatingKey)).toThrow(/sparse arrays/u);
    const arrayWithExtra = ['value'] as string[] & { extra?: string };
    arrayWithExtra.extra = 'not-json';
    expect(() => canonicalizeJson(arrayWithExtra)).toThrow(/extra array properties/u);
    for (const nonJsonObject of [new Date(), new Map(), new Set()]) {
      expect(() => canonicalizeJson(nonJsonObject)).toThrow(/plain JSON objects/u);
    }
  });

  it('fails closed for missing, extra, and digest drift', () => {
    const drifted = {
      ...capabilitySlices,
      web: {
        ...capabilitySlices.web,
        catalogDigest: 'sha256:drift',
        surfaceIds: ['app-shell', 'future-agent'],
      },
    };
    expect(validateCapabilitySlices(drifted)).toEqual([
      'web:CATALOG_DIGEST_MISMATCH',
      'web:MISSING:runtime-health,theme-control',
      'web:EXTRA:future-agent',
    ]);
  });

  it('rejects slice identity/duplicates and any future Story 1.1 capability', () => {
    const identityDrift = {
      ...capabilitySlices,
      worker: {
        ...capabilitySlices.worker,
        name: 'server',
        surfaceIds: ['runtime-health', 'runtime-health'],
      },
    } as unknown as typeof capabilitySlices;
    expect(validateCapabilitySlices(identityDrift)).toEqual([
      'worker:NAME_MISMATCH',
      'worker:DUPLICATE:runtime-health',
    ]);
    expect(
      validateStory11ExactCatalog({
        ...capabilityCatalog,
        surfaces: [
          ...capabilityCatalog.surfaces,
          { consumers: ['web'], id: 'future-capability', stage: 'S0-V' },
        ],
      }),
    ).toEqual(['STORY_1_1_EXACT_CATALOG_MISMATCH']);
  });

  it('accepts only bounded header-safe Worker credentials', () => {
    expect(validateWorkerCredential('worker-token-0001')).toBe('worker-token-0001');
    for (const invalid of ['', 'too-short', 'contains whitespace 0001', 'contains/slash/0001']) {
      expect(() => validateWorkerCredential(invalid)).toThrow('WORKER_CREDENTIAL_INVALID');
    }
  });
});

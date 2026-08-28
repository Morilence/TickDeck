import { canonicalizeJson } from './canonical-json.js';

export type SliceName = 'web' | 'server' | 'worker';

export const capabilityCatalog = {
  schemaVersion: '1.0.0',
  stage: 'S0-V',
  surfaces: [
    { consumers: ['server', 'web'], id: 'app-shell', stage: 'S0-V' },
    { consumers: ['server', 'web', 'worker'], id: 'runtime-health', stage: 'S0-V' },
    { consumers: ['web'], id: 'theme-control', stage: 'S0-V' },
  ],
} as const;

// Story 1.1 is a structural seed, not an extensible catalog baseline. Keep this independent
// allowlist literal so adding a future capability and recomputing its digest still fails build.
export const story11ExactCapabilityCatalog = {
  schemaVersion: '1.0.0',
  stage: 'S0-V',
  surfaces: [
    { consumers: ['server', 'web'], id: 'app-shell', stage: 'S0-V' },
    { consumers: ['server', 'web', 'worker'], id: 'runtime-health', stage: 'S0-V' },
    { consumers: ['web'], id: 'theme-control', stage: 'S0-V' },
  ],
} as const;

export const catalogDigestDomain = 'tickdeck:capability-catalog:v1';

export const catalogCanonicalJson = canonicalizeJson(capabilityCatalog);

export const catalogDigest =
  'sha256:17c3af3c0f474238648e7b9b367b5c8da109de18215ed05cb9edd95c609a042b';

function expectedSurfaceIds(sliceName: SliceName): string[] {
  return capabilityCatalog.surfaces
    .filter((surface) => (surface.consumers as readonly string[]).includes(sliceName))
    .map((surface) => surface.id)
    .sort();
}

export type CapabilitySlice = Readonly<{
  catalogDigest: string;
  name: SliceName;
  surfaceIds: readonly string[];
}>;

export const capabilitySlices: Readonly<Record<SliceName, CapabilitySlice>> = {
  web: {
    catalogDigest,
    name: 'web',
    surfaceIds: expectedSurfaceIds('web'),
  },
  server: {
    catalogDigest,
    name: 'server',
    surfaceIds: expectedSurfaceIds('server'),
  },
  worker: {
    catalogDigest,
    name: 'worker',
    surfaceIds: expectedSurfaceIds('worker'),
  },
};

export const releaseManifest = {
  schemaVersion: '1.0.0',
  stage: 'S0-V',
  catalogDigest,
  slices: capabilitySlices,
} as const;

export function validateCapabilitySlices(
  slices: Readonly<Record<SliceName, CapabilitySlice>>,
): readonly string[] {
  const errors: string[] = [];
  for (const name of ['web', 'server', 'worker'] as const) {
    const slice = slices[name];
    if (slice.name !== name) errors.push(`${name}:NAME_MISMATCH`);
    if (slice.catalogDigest !== catalogDigest) errors.push(`${name}:CATALOG_DIGEST_MISMATCH`);
    const expected = expectedSurfaceIds(name);
    const declared = [...slice.surfaceIds];
    const duplicates = declared.filter((id, index) => declared.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`${name}:DUPLICATE:${[...new Set(duplicates)].sort().join(',')}`);
    }
    const actual = [...declared].sort();
    const missing = expected.filter((id) => !actual.includes(id));
    const extra = actual.filter((id) => !expected.includes(id));
    if (missing.length > 0) errors.push(`${name}:MISSING:${missing.join(',')}`);
    if (extra.length > 0) errors.push(`${name}:EXTRA:${extra.join(',')}`);
    if (
      missing.length === 0 &&
      extra.length === 0 &&
      duplicates.length === 0 &&
      JSON.stringify(declared) !== JSON.stringify(expected)
    ) {
      errors.push(`${name}:SURFACE_ORDER_MISMATCH`);
    }
  }
  return errors;
}

export function validateStory11ExactCatalog(value: unknown): readonly string[] {
  try {
    return canonicalizeJson(value) === canonicalizeJson(story11ExactCapabilityCatalog)
      ? []
      : ['STORY_1_1_EXACT_CATALOG_MISMATCH'];
  } catch {
    return ['STORY_1_1_EXACT_CATALOG_MISMATCH'];
  }
}

export type WorkerHandshake = Readonly<{
  buildCatalogDigest: string;
  businessHandlerCount: 0;
  protocolVersion: 'tickdeck-local-health-v1';
  role: 'worker';
  status: 'ready';
  surfaceIds: readonly string[];
}>;

export function validateWorkerCredential(value: string): string {
  if (!/^[A-Za-z0-9_-]{16,256}$/u.test(value)) {
    throw new TypeError('WORKER_CREDENTIAL_INVALID');
  }
  return value;
}

export type HealthSnapshot = Readonly<{
  schemaVersion: '1.0.0';
  code: 'TICKDECK_HEALTHY' | 'TICKDECK_DEGRADED';
  stage: 'S0-V';
  catalogDigest: string;
  worker: Readonly<{
    code:
      | 'WORKER_HEALTHY'
      | 'WORKER_UNAVAILABLE'
      | 'WORKER_AUTH_REJECTED'
      | 'WORKER_PROTOCOL_MISMATCH'
      | 'WORKER_CATALOG_MISMATCH';
  }>;
}>;

export const structuralSeed = '@tickdeck/contracts:S0-V';

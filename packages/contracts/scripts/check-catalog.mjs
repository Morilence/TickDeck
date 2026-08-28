import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import { canonicalizeJson, domainSeparatedSha256 } from '../../../tools/quality/digest.mjs';

const execFile = promisify(execFileCallback);
const buildDirectory = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-catalog-check-'));
let source;
try {
  await execFile(process.execPath, [
    path.resolve(import.meta.dirname, '../../../node_modules/typescript/bin/tsc'),
    '--project',
    path.resolve(import.meta.dirname, '../tsconfig.json'),
    '--outDir',
    buildDirectory,
    '--noEmit',
    'false',
    '--composite',
    'false',
    '--incremental',
    'false',
    '--declaration',
    'false',
    '--declarationMap',
    'false',
    '--sourceMap',
    'false',
  ]);
  source = await import(pathToFileURL(path.join(buildDirectory, 'index.js')).href);
} finally {
  await rm(buildDirectory, { recursive: true, force: true });
}
const canonical = canonicalizeJson(source.capabilityCatalog);
if (canonical !== source.catalogCanonicalJson) {
  throw new Error('catalog RFC 8785 implementations drifted');
}
const actual = domainSeparatedSha256(source.catalogDigestDomain, Buffer.from(canonical, 'utf8'));
if (actual !== source.catalogDigest) {
  console.error(`catalog digest drift: expected=${source.catalogDigest} actual=${actual}`);
  process.exitCode = 1;
} else {
  const sliceErrors = source.validateCapabilitySlices(source.capabilitySlices);
  if (sliceErrors.length > 0) {
    throw new Error(`capability slice drift: ${sliceErrors.join(';')}`);
  }
  const exactCatalogErrors = source.validateStory11ExactCatalog(source.capabilityCatalog);
  if (exactCatalogErrors.length > 0) {
    throw new Error(`Story 1.1 exact catalog drift: ${exactCatalogErrors.join(';')}`);
  }
  if (source.releaseManifest.catalogDigest !== source.catalogDigest) {
    throw new Error('Release Manifest catalog digest drift');
  }
  for (const name of ['web', 'server', 'worker']) {
    if (source.releaseManifest.slices[name] !== source.capabilitySlices[name]) {
      throw new Error(`Release Manifest ${name} slice 未绑定 canonical projection`);
    }
  }
  console.log(`catalog-check passed: domain=${source.catalogDigestDomain} digest=${actual}`);
}

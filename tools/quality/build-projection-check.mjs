import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { classifyInternalEdge, members } from './workspace-policy.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const nameToDirectory = new Map(
  Object.entries(members).map(([directory, definition]) => [definition.name, directory]),
);

async function walk(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return files;
    throw error;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (/\.(?:[cm]?js|d\.[cm]?ts)$/u.test(entry.name)) files.push(absolute);
  }
  return files;
}

export function artifactProjectionFailures(artifacts) {
  const failures = [];
  for (const artifact of artifacts) {
    const owner = Object.keys(members).find((directory) =>
      artifact.path.startsWith(`${directory}/`),
    );
    if (!owner) {
      failures.push(`built artifact 无 workspace owner: ${artifact.path}`);
      continue;
    }
    const importedNames = new Set(artifact.content.match(/@tickdeck\/[a-z0-9-]+/gu) ?? []);
    for (const importedName of importedNames) {
      const target = nameToDirectory.get(importedName);
      if (!target || target === owner) continue;
      if (classifyInternalEdge(owner, target, 'production') !== 'runtime') {
        failures.push(`${artifact.path} 含非法 production projection ${owner}->${target}`);
      }
    }
    if (owner !== 'packages/testkit' && artifact.content.includes('@tickdeck/testkit')) {
      failures.push(`${artifact.path} 不得把 testkit 投影到 production declaration/bundle`);
    }
    if (/\bvitest(?:\/|['"])/u.test(artifact.content)) {
      failures.push(`${artifact.path} 不得包含 Vitest runtime`);
    }
  }
  return failures;
}

export async function runBuildProjectionCheck() {
  const artifacts = [];
  const missing = [];
  for (const directory of Object.keys(members)) {
    if (directory === 'apps/desktop') continue;
    const files = await walk(path.join(root, directory, 'dist'));
    if (files.length === 0) missing.push(`${directory}/dist`);
    for (const file of files) {
      artifacts.push({
        content: await readFile(file, 'utf8'),
        path: path.relative(root, file).split(path.sep).join('/'),
      });
    }
  }
  const failures = [
    ...missing.map((item) => `built projection 缺失: ${item}`),
    ...artifactProjectionFailures(artifacts),
  ];
  if (failures.length > 0) {
    console.error(`build-projection-check failed (${failures.length})`);
    for (const failure of failures) console.error(`- ${failure}`);
    return 1;
  }
  console.log(`build-projection-check passed: artifacts=${artifacts.length}`);
  return 0;
}

if (process.argv[1] === import.meta.filename) {
  process.exitCode = await runBuildProjectionCheck();
}

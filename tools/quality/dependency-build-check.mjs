import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const execFile = promisify(execFileCallback);
const root = path.resolve(import.meta.dirname, '../..');

async function lifecyclePackages() {
  const virtualStore = path.join(root, 'node_modules/.pnpm');
  const packages = new Set();

  async function inspectPackage(packagePath) {
    try {
      const name = await inspectLifecyclePackage(packagePath);
      if (name) packages.add(name);
    } catch (error) {
      throw new Error(`lifecycle package inspection failed: ${packagePath}: ${error.message}`, {
        cause: error,
      });
    }
  }

  for (const entry of await readdir(virtualStore, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const nodeModules = path.join(virtualStore, entry.name, 'node_modules');
    let children;
    try {
      children = await readdir(nodeModules, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const child of children) {
      if (!child.isDirectory() && !child.isSymbolicLink()) continue;
      if (!child.name.startsWith('@')) {
        await inspectPackage(path.join(nodeModules, child.name));
        continue;
      }
      const scope = path.join(nodeModules, child.name);
      for (const scopedPackage of await readdir(scope, { withFileTypes: true })) {
        if (scopedPackage.isDirectory() || scopedPackage.isSymbolicLink()) {
          await inspectPackage(path.join(scope, scopedPackage.name));
        }
      }
    }
  }
  return packages;
}

export async function inspectLifecyclePackage(packagePath, readManifest = readFile) {
  let source;
  try {
    source = await readManifest(path.join(packagePath, 'package.json'), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined;
    throw error;
  }
  let manifest;
  try {
    manifest = JSON.parse(source);
  } catch (error) {
    throw new TypeError(`malformed package.json: ${error.message}`, { cause: error });
  }
  if (
    typeof manifest !== 'object' ||
    manifest === null ||
    typeof manifest.name !== 'string' ||
    manifest.name.length === 0 ||
    (manifest.scripts !== undefined &&
      (typeof manifest.scripts !== 'object' || manifest.scripts === null))
  ) {
    throw new TypeError('malformed package.json shape');
  }
  const scripts = manifest.scripts ?? {};
  return scripts.preinstall || scripts.install || scripts.postinstall ? manifest.name : undefined;
}

export function allowBuildDecisions(workspace) {
  const decisions = new Map();
  let inAllowBuilds = false;
  for (const line of workspace.split(/\r?\n/u)) {
    if (line === 'allowBuilds:') {
      inAllowBuilds = true;
      continue;
    }
    if (inAllowBuilds && /^\S/u.test(line)) break;
    const match = line.match(/^ {2}(['"]?)(.+?)\1: (true|false)$/u);
    if (inAllowBuilds && match) decisions.set(match[2], match[3] === 'true');
  }
  return decisions;
}

export function ignoredPackageNames(output) {
  const ignored = new Set();
  for (const line of output.split(/\r?\n/u)) {
    const candidate = line.trim();
    if (
      candidate.length === 0 ||
      candidate === 'None' ||
      candidate.endsWith(':') ||
      candidate.startsWith('Cannot identify') ||
      candidate.startsWith('Version ')
    ) {
      continue;
    }
    const name = candidate.startsWith('@')
      ? candidate.slice(0, candidate.lastIndexOf('@')) || candidate
      : candidate.includes('@')
        ? candidate.slice(0, candidate.indexOf('@'))
        : candidate;
    ignored.add(name);
  }
  return ignored;
}

export function buildPolicyFailures(requiringBuild, decisions, actualIgnored) {
  const expectedIgnored = new Set(
    [...decisions].filter(([, allowed]) => !allowed).map(([name]) => name),
  );
  const missing = [...requiringBuild].filter((name) => !decisions.has(name)).sort();
  const extra = [...decisions.keys()].filter((name) => !requiringBuild.has(name)).sort();
  const placeholders = [...decisions].filter(([name]) => /placeholder|todo|tbd/iu.test(name));
  const unexpected = [...actualIgnored].filter((name) => !expectedIgnored.has(name)).sort();
  const absent = [...expectedIgnored].filter((name) => !actualIgnored.has(name)).sort();
  return [
    ...(missing.length ? [`未裁决 lifecycle packages: ${missing.join(', ')}`] : []),
    ...(extra.length ? [`非 lifecycle package 裁决: ${extra.join(', ')}`] : []),
    ...(placeholders.length ? ['allowBuilds 含 placeholder'] : []),
    ...(unexpected.length ? [`额外阻断: ${unexpected.join(', ')}`] : []),
    ...(absent.length ? [`缺失阻断: ${absent.join(', ')}`] : []),
  ];
}

export async function runDependencyBuildCheck() {
  await readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8');
  const workspace = await readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  const requiringBuild = await lifecyclePackages();
  const decisions = allowBuildDecisions(workspace);
  const output = await execFile('pnpm', ['ignored-builds'], {
    cwd: root,
    env: { ...process.env, CI: '1', NO_COLOR: '1' },
  })
    .then(({ stdout }) => stdout)
    .catch((error) => {
      console.error('dependency-build-check 无法读取 pnpm ignored-builds');
      throw error;
    });
  const actualIgnored = ignoredPackageNames(output);
  const failures = buildPolicyFailures(requiringBuild, decisions, actualIgnored);
  if (failures.length > 0) {
    console.error('dependency-build-check failed');
    for (const failure of failures) console.error(`- ${failure}`);
    return 1;
  }
  console.log(
    `dependency-build-check passed: reviewed=${requiringBuild.size}, blocked=${actualIgnored.size}`,
  );
  return 0;
}

if (process.argv[1] === import.meta.filename) {
  process.exitCode = await runDependencyBuildCheck();
}

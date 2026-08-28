import { spawn } from 'node:child_process';
import { cp, lstat, mkdtemp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { domainSeparatedSha256 } from './digest.mjs';
import { classifyInternalEdge, members } from './workspace-policy.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '../..');
const defaultRegistry = path.join(import.meta.dirname, 'generated-manifests');
const skippedDirectories = new Set([
  'node_modules',
  '.git',
  '_bmad',
  '_bmad-output',
  '.agents',
  'target',
  'dist',
  'build',
  'coverage',
  'storybook-static',
  'playwright-report',
  'test-results',
]);

function safeRelativePath(value, label) {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    path.isAbsolute(value) ||
    value.split(/[\\/]/u).includes('..')
  ) {
    throw new TypeError(`${label} 必须是 repository-relative safe path`);
  }
  return value.split(path.sep).join('/');
}

function generatedRootFor(output) {
  const match = output.match(/^(.*?\/generated)(?:\/|$)/u);
  if (!match) throw new TypeError(`generated output 不在 generated root: ${output}`);
  return match[1];
}

async function walkFiles(directory, base = directory) {
  const found = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return found;
    throw error;
  }
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new TypeError(`generated tree 包含 symlink: ${absolute}`);
    if (entry.isDirectory()) found.push(...(await walkFiles(absolute, base)));
    else found.push(path.relative(base, absolute).split(path.sep).join('/'));
  }
  return found;
}

async function findGeneratedRoots(directory, root) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() && entry.name === 'generated') {
      throw new TypeError(
        `generated root 不得是 symlink: ${path.relative(root, path.join(directory, entry.name))}`,
      );
    }
    if (!entry.isDirectory() || skippedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.name === 'generated') {
      found.push(path.relative(root, absolute).split(path.sep).join('/'));
    } else {
      found.push(...(await findGeneratedRoots(absolute, root)));
    }
  }
  return found;
}

async function assertNoSymlink(root, relativePath, label) {
  let current = root;
  for (const segment of relativePath.split('/')) {
    current = path.join(current, segment);
    const metadata = await lstat(current);
    if (metadata.isSymbolicLink())
      throw new TypeError(`${label} 不得包含 symlink: ${relativePath}`);
  }
}

async function loadManifests(root, registry) {
  const names = (await readdir(registry)).filter((name) => name.endsWith('.json')).sort();
  const manifests = [];
  for (const name of names) {
    const manifest = JSON.parse(await readFile(path.join(registry, name), 'utf8'));
    for (const required of [
      'schemaVersion',
      'owner',
      'inputs',
      'outputs',
      'toolPath',
      'toolDigest',
      'command',
      'consumers',
    ]) {
      if (!(required in manifest)) throw new TypeError(`${name} 缺少 ${required}`);
    }
    if (manifest.schemaVersion !== '1.0.0') throw new TypeError(`${name}.schemaVersion 漂移`);
    manifest.owner = safeRelativePath(manifest.owner, `${name}.owner`);
    if (!(manifest.owner in members)) throw new TypeError(`${name}.owner 不是已知 workspace`);
    await assertNoSymlink(root, manifest.owner, `${name}.owner`);
    if (!Array.isArray(manifest.inputs) || manifest.inputs.length === 0) {
      throw new TypeError(`${name}.inputs 必须非空`);
    }
    manifest.inputs = manifest.inputs.map((item) => safeRelativePath(item, `${name}.inputs`));
    if (new Set(manifest.inputs).size !== manifest.inputs.length) {
      throw new TypeError(`${name}.inputs 含重复 path`);
    }
    for (const input of manifest.inputs) await assertNoSymlink(root, input, `${name}.inputs`);
    if (!Array.isArray(manifest.outputs) || manifest.outputs.length === 0) {
      throw new TypeError(`${name}.outputs 必须是非空 exact path 集合`);
    }
    manifest.outputs = manifest.outputs.map((item) => safeRelativePath(item, `${name}.outputs`));
    if (new Set(manifest.outputs).size !== manifest.outputs.length) {
      throw new TypeError(`${name}.outputs 含重复 path`);
    }
    for (const output of manifest.outputs) {
      if (!output.startsWith(`${manifest.owner}/`)) {
        throw new TypeError(`${name}.outputs 必须位于 owner workspace`);
      }
      generatedRootFor(output);
      await assertNoSymlink(root, output, `${name}.outputs`);
    }
    manifest.toolPath = safeRelativePath(manifest.toolPath, `${name}.toolPath`);
    await assertNoSymlink(root, manifest.toolPath, `${name}.toolPath`);
    if (!manifest.inputs.includes(manifest.toolPath)) {
      throw new TypeError(`${name}.toolPath 必须列入 inputs`);
    }
    if (
      !Array.isArray(manifest.command) ||
      manifest.command.length === 0 ||
      !manifest.command.every((item) => typeof item === 'string' && item.length > 0)
    ) {
      throw new TypeError(`${name}.command 必须是无 shell 的 argv 数组`);
    }
    if (!manifest.command.includes(manifest.toolPath)) {
      throw new TypeError(`${name}.command 必须引用 toolPath`);
    }
    if (
      !Array.isArray(manifest.consumers) ||
      manifest.consumers.length === 0 ||
      !manifest.consumers.every((consumer) => typeof consumer === 'string') ||
      new Set(manifest.consumers).size !== manifest.consumers.length
    ) {
      throw new TypeError(`${name}.consumers 必须是非空、不重复的 workspace 数组`);
    }
    for (const consumer of manifest.consumers) {
      if (!(consumer in members)) throw new TypeError(`${name}.consumers 含未知 workspace`);
      if (
        consumer !== manifest.owner &&
        classifyInternalEdge(consumer, manifest.owner, 'build') === 'denied'
      ) {
        throw new TypeError(`${name}.consumers 含未授权 build consumer`);
      }
    }
    if (!/^sha256:[a-f0-9]{64}$/u.test(manifest.toolDigest)) {
      throw new TypeError(`${name}.toolDigest 必须是规范 digest 文本`);
    }
    const actualToolDigest = domainSeparatedSha256(
      `tickdeck:generated-tool:v1:${manifest.toolPath}`,
      await readFile(path.join(root, manifest.toolPath)),
    );
    if (actualToolDigest !== manifest.toolDigest) {
      throw new TypeError(`${name}.toolDigest 与 tool artifact bytes 不一致`);
    }
    manifests.push({ ...manifest, name });
  }
  return manifests;
}

function terminateProcessTree(child, signal) {
  if (child.pid === undefined) return;
  try {
    if (process.platform === 'win32') child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error;
  }
}

export function executeGenerator(command, cwd, { timeoutMs = 10_000 } = {}) {
  return new Promise((resolve, reject) => {
    const childEnvironment = { ...process.env };
    delete childEnvironment.NO_COLOR;
    delete childEnvironment.FORCE_COLOR;
    const child = spawn(command[0], command.slice(1), {
      cwd,
      env: childEnvironment,
      detached: process.platform !== 'win32',
      shell: false,
      stdio: 'pipe',
    });
    let output = '';
    let timedOut = false;
    let forceKillTimer;
    const timeout = setTimeout(() => {
      timedOut = true;
      terminateProcessTree(child, 'SIGTERM');
      forceKillTimer = setTimeout(() => terminateProcessTree(child, 'SIGKILL'), 250);
      forceKillTimer.unref();
    }, timeoutMs);
    timeout.unref();
    child.stdout.on('data', (chunk) => (output += chunk.toString()));
    child.stderr.on('data', (chunk) => (output += chunk.toString()));
    child.on('error', (error) => {
      clearTimeout(timeout);
      if (forceKillTimer) clearTimeout(forceKillTimer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (forceKillTimer) clearTimeout(forceKillTimer);
      if (timedOut) reject(new Error(`generator timeout after ${timeoutMs}ms`));
      else if (code === 0) resolve();
      else reject(new Error(`generator exit=${code}: ${output.trim()}`));
    });
  });
}

export async function generatedCheckFailures(root, registry, options = {}) {
  const failures = [];
  let manifests;
  try {
    manifests = await loadManifests(root, registry);
  } catch (error) {
    return [`manifest invalid: ${error.message}`];
  }
  const outputOwners = new Map();
  const registeredRoots = new Set();
  for (const manifest of manifests) {
    for (const output of manifest.outputs) {
      if (outputOwners.has(output)) failures.push(`generated output 重复 owner: ${output}`);
      outputOwners.set(output, manifest.name);
      registeredRoots.add(generatedRootFor(output));
    }
  }

  let actualRoots;
  try {
    actualRoots = new Set(await findGeneratedRoots(root, root));
  } catch (error) {
    return [`generated tree invalid: ${error.message}`];
  }
  for (const actual of actualRoots) {
    if (!registeredRoots.has(actual)) failures.push(`未注册 generated root: ${actual}`);
  }
  for (const registered of registeredRoots) {
    if (!actualRoots.has(registered))
      failures.push(`registered generated root 缺失: ${registered}`);
  }
  const committedPaths = [];
  for (const generatedRoot of actualRoots) {
    if (!registeredRoots.has(generatedRoot)) continue;
    for (const file of await walkFiles(path.join(root, generatedRoot))) {
      committedPaths.push(`${generatedRoot}/${file}`);
    }
  }
  const expectedCommittedPaths = [...outputOwners.keys()].toSorted();
  if (JSON.stringify(committedPaths.toSorted()) !== JSON.stringify(expectedCommittedPaths)) {
    failures.push(
      `committed exact path drift: expected=${expectedCommittedPaths.join(',')} actual=${committedPaths.toSorted().join(',')}`,
    );
  }
  if (manifests.length === 0 || failures.length > 0) return failures;

  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-generated-check-'));
  try {
    for (const manifest of manifests) {
      for (const input of manifest.inputs) {
        const source = path.join(root, input);
        const destination = path.join(temporaryRoot, input);
        await mkdir(path.dirname(destination), { recursive: true });
        await cp(source, destination, { recursive: true, dereference: false });
      }
    }
    for (const manifest of manifests) {
      try {
        await executeGenerator(manifest.command, temporaryRoot, {
          timeoutMs: options.timeoutMs ?? 10_000,
        });
      } catch (error) {
        failures.push(`${manifest.name} rebuild failed: ${error.message}`);
      }
    }
    if (failures.length > 0) return failures;

    const rebuiltRoots = new Set(await findGeneratedRoots(temporaryRoot, temporaryRoot));
    const rebuiltPaths = [];
    for (const generatedRoot of rebuiltRoots) {
      for (const file of await walkFiles(path.join(temporaryRoot, generatedRoot))) {
        rebuiltPaths.push(`${generatedRoot}/${file}`);
      }
    }
    const expectedPaths = [...outputOwners.keys()].toSorted();
    const actualPaths = rebuiltPaths.toSorted();
    if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
      failures.push(
        `rebuild exact path drift: expected=${expectedPaths.join(',')} actual=${actualPaths.join(',')}`,
      );
      return failures;
    }
    for (const output of expectedPaths) {
      const committed = await readFile(path.join(root, output));
      const rebuilt = await readFile(path.join(temporaryRoot, output));
      if (!committed.equals(rebuilt)) failures.push(`rebuild exact byte drift: ${output}`);
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
  return failures;
}

export async function runGeneratedCheck(root = repositoryRoot, registry = defaultRegistry) {
  const manifests = (await readdir(registry)).filter((name) => name.endsWith('.json'));
  const roots = await findGeneratedRoots(root, root);
  const failures = await generatedCheckFailures(root, registry);
  if (failures.length > 0) {
    console.error(`generated-check failed (${failures.length})`);
    for (const failure of failures) console.error(`- ${failure}`);
    return 1;
  }
  console.log(`generated-check passed: manifests=${manifests.length}, roots=${roots.length}`);
  return 0;
}

if (process.argv[1] === import.meta.filename) {
  process.exitCode = await runGeneratedCheck();
}

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import {
  canonicalIgnores,
  classifyInternalEdge,
  dependencyEdges,
  internalPackageName,
  members,
  profiles,
  requiredLeafScripts,
} from './workspace-policy.mjs';
import {
  compilerProfileContract,
  forbiddenCompilerOverrideFailures,
  githubRulesetEvidenceFailures,
  qualityWorkflowFailures,
  workspaceConfigurationFailures,
  workspacePolicyFailures,
} from './workspace-contract-checks.mjs';
import { canonicalJsonDigest, domainSeparatedSha256 } from './digest.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const failures = [];

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
}

async function exists(relativePath) {
  try {
    await stat(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function collectImports(source) {
  return [...source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)(['"])(@tickdeck\/[^'"]+)\1/gu)]
    .map((match) => internalPackageName(match[2]))
    .filter((name) => name !== undefined);
}

function authoredSurface(directory, file) {
  const relative = file.slice(directory.length + 1);
  if (
    /(?:^|\/)tests?\//u.test(relative) ||
    /\.test\.[cm]?[jt]sx?$/u.test(relative) ||
    /^src\/stories\//u.test(relative)
  ) {
    return 'test';
  }
  if (
    /^(?:scripts|fixtures|config)\//u.test(relative) ||
    /^\.storybook\//u.test(relative) ||
    /^[^/]+\.config\.[cm]?[jt]s$/u.test(relative)
  ) {
    return 'build';
  }
  return relative.startsWith('src/') ? 'production' : undefined;
}

async function walkAuthored(directory) {
  const absolute = path.join(root, directory);
  const entries = await readdir(absolute, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (
        ['node_modules', 'dist', 'build', 'coverage', 'target', 'generated'].includes(entry.name)
      ) {
        continue;
      }
      files.push(...(await walkAuthored(relative)));
    } else {
      files.push(relative);
    }
  }
  return files;
}

const rootManifest = await readJson('package.json');
assert(rootManifest.packageManager === 'pnpm@11.24.0', '根 packageManager 必须是 pnpm@11.24.0');
assert(rootManifest.engines?.node === '24.20.0', '根 Node engine 必须精确为 24.20.0');
assert(rootManifest.scripts?.prepare === 'husky', 'prepare 必须仅为 husky');

for (const failure of workspacePolicyFailures({
  dependencyEdges,
  canonicalIgnores,
  members,
  profiles,
  requiredLeafScripts,
})) {
  assert(false, failure);
}

for (const [file, expected] of Object.entries(compilerProfileContract)) {
  const actual = await readJson(file);
  assert(actual.extends === expected.extends, `${file} extends 漂移`);
  assert(
    JSON.stringify(actual.compilerOptions) === JSON.stringify(expected.compilerOptions),
    `${file} compilerOptions 漂移、缺失或含 forbidden override`,
  );
}

const recursiveCommand =
  'pnpm --filter "./apps/*" --filter "./packages/*" --filter "./tools/*" --fail-if-no-match --recursive --if-present run';
for (const [rootScript, leafScript] of [
  ['typecheck:ts', 'typecheck'],
  ['codegen:check', 'codegen:check'],
  ['test:unit', 'test:unit'],
]) {
  assert(
    rootManifest.scripts?.[rootScript]?.includes(`${recursiveCommand} ${leafScript}`),
    `${rootScript} 必须调度完整 recursive leaf contract；--if-present 仅由本 validator 保护`,
  );
}
const serialBuildCommand =
  'pnpm run workspace:check && pnpm --workspace-concurrency=1 --filter "./apps/*" --filter "./packages/*" --filter "./tools/*" --fail-if-no-match --recursive --if-present run build';
assert(
  rootManifest.scripts?.['build:ts'] === serialBuildCommand,
  'build:ts 必须单并发调度完整 leaf contract，禁止共享 project-reference 并行写入',
);

for (const section of ['dependencies', 'devDependencies']) {
  for (const [name, version] of Object.entries(rootManifest[section] ?? {})) {
    assert(
      typeof version === 'string' && !/[~^*]|latest|next/u.test(version),
      `根依赖 ${name} 必须使用精确版本`,
    );
  }
}

const actualMembers = [];
for (const group of ['apps', 'packages', 'tools']) {
  for (const entry of await readdir(path.join(root, group), { withFileTypes: true })) {
    if (entry.isDirectory() && (await exists(`${group}/${entry.name}/package.json`))) {
      actualMembers.push(`${group}/${entry.name}`);
    }
  }
}
actualMembers.sort();
const expectedMembers = Object.keys(members).sort();
assert(
  JSON.stringify(actualMembers) === JSON.stringify(expectedMembers),
  `直接 workspace member 漂移: expected=${expectedMembers.join(',')} actual=${actualMembers.join(',')}`,
);
assert(!(await exists('tools/quality/package.json')), 'tools/quality 不得成为 workspace package');

const nameToDirectory = new Map(
  Object.entries(members).map(([directory, item]) => [item.name, directory]),
);
const runtimeEdgeKeys = new Set(
  dependencyEdges
    .filter(([, , edgeClass]) => edgeClass === 'runtime')
    .map(([from, to]) => `${from}->${to}`),
);
const realizedRuntimeEdges = new Set();

for (const [directory, definition] of Object.entries(members)) {
  const manifest = await readJson(`${directory}/package.json`);
  assert(manifest.name === definition.name, `${directory} package name 漂移`);
  assert(manifest.type === 'module', `${directory} 必须是 ESM`);
  for (const script of requiredLeafScripts) {
    assert(
      typeof manifest.scripts?.[script] === 'string',
      `${directory} 缺少 leaf script ${script}`,
    );
  }
  if (directory === 'apps/web') {
    assert(
      typeof manifest.scripts?.['test:component'] === 'string',
      'apps/web 缺少 test:component',
    );
  }
  for (const section of ['dependencies', 'devDependencies']) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      assert(
        typeof version === 'string' && !/[~^*]|latest|next/u.test(version),
        `${directory} 依赖 ${name} 必须精确锁定`,
      );
      const targetDirectory = nameToDirectory.get(name);
      if (!targetDirectory) continue;
      const allowedClasses = dependencyEdges
        .filter(([from, to]) => from === directory && to === targetDirectory)
        .map(([, , edgeClass]) => edgeClass);
      if (section === 'dependencies') {
        assert(allowedClasses.includes('runtime'), `${directory} 非法 runtime dependency ${name}`);
      } else {
        assert(
          allowedClasses.some((edgeClass) => ['test/dev', 'build/codegen'].includes(edgeClass)),
          `${directory} 非法 dev dependency ${name}`,
        );
      }
    }
  }

  const tsconfig = await readJson(`${directory}/tsconfig.json`);
  const profile = profiles[definition.profile];
  assert(tsconfig.extends === profile.extends, `${directory} tsconfig profile 漂移`);
  assert(
    tsconfig.compilerOptions?.rootDir === profile.rootDir,
    `${directory} rootDir 必须显式声明`,
  );
  assert(Array.isArray(tsconfig.compilerOptions?.types), `${directory} 必须显式声明 ambient types`);
  const expectedTypes = {
    web: ['vite/client'],
    'node-runtime': ['node'],
    'neutral-shared': [],
    'node-config-only': ['node'],
  }[definition.profile];
  assert(
    JSON.stringify(tsconfig.compilerOptions?.types) === JSON.stringify(expectedTypes),
    `${directory} ambient types 漂移`,
  );
  for (const forbidden of forbiddenCompilerOverrideFailures(tsconfig.compilerOptions, {
    desktopNarrowing: directory === 'apps/desktop',
  })) {
    assert(
      !(forbidden in tsconfig.compilerOptions),
      `${directory} 禁止覆盖 profile option ${forbidden}`,
    );
  }
  if (directory === 'apps/desktop') {
    assert(tsconfig.compilerOptions.allowJs === false, 'apps/desktop 必须收紧 allowJs=false');
    assert(tsconfig.compilerOptions.checkJs === false, 'apps/desktop 必须收紧 checkJs=false');
  }

  const testConfig = await readJson(`${directory}/tsconfig.test.json`);
  const expectedTestExtends =
    definition.profile === 'web' ? '../../tsconfig.test.web.json' : '../../tsconfig.test.node.json';
  assert(testConfig.extends === expectedTestExtends, `${directory} test overlay profile 漂移`);
  const expectedTestTypes =
    definition.profile === 'web'
      ? ['vite/client', 'vitest/globals', 'node']
      : ['node', 'vitest/globals'];
  assert(
    JSON.stringify(testConfig.compilerOptions?.types) === JSON.stringify(expectedTestTypes),
    `${directory} test overlay ambient types 漂移`,
  );
  for (const forbidden of forbiddenCompilerOverrideFailures(testConfig.compilerOptions)) {
    assert(
      !(forbidden in testConfig.compilerOptions),
      `${directory} test overlay 禁止覆盖 ${forbidden}`,
    );
  }

  const files = await walkAuthored(directory).catch(() => []);
  for (const file of files.filter((item) => /\.[cm]?[jt]sx?$/u.test(item))) {
    const surface = authoredSurface(directory, file);
    if (!surface) continue;
    const source = await readFile(path.join(root, file), 'utf8');
    for (const importedName of collectImports(source)) {
      const targetDirectory = nameToDirectory.get(importedName);
      if (!targetDirectory) continue;
      const edgeClass = classifyInternalEdge(directory, targetDirectory, surface);
      assert(
        edgeClass !== 'denied',
        `${file} 通过 ${surface} surface 非法导入 ${importedName}（含 subpath）`,
      );
      if (surface === 'production') realizedRuntimeEdges.add(`${directory}->${targetDirectory}`);
    }
  }
}

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.config\.[cm]?[jt]s$/u.test(entry.name)) continue;
  const source = await readFile(path.join(root, entry.name), 'utf8');
  for (const importedName of collectImports(source)) {
    assert(false, `${entry.name} 根 build/config surface 禁止内部 package import: ${importedName}`);
  }
}

for (const relativePath of [
  'apps/server/src/index.ts',
  'apps/worker/src/index.ts',
  'tools/quality/start-stack.mjs',
]) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  assert(
    !/process\.env\.[A-Z0-9_]*(?:TOKEN|SECRET|CREDENTIAL)/u.test(source) &&
      !source.includes('TICKDECK_WORKER_TOKEN'),
    `${relativePath} 不得通过 environment 传递 Worker credential`,
  );
}
const stackSource = await readFile(path.join(root, 'tools/quality/start-stack.mjs'), 'utf8');
assert(
  stackSource.includes('worker.stdin.end(workerToken)') &&
    stackSource.includes('server.stdin.end(workerToken)'),
  'start-stack 必须以 inherited stdin pipe 单次交接 Worker credential',
);

for (const edge of runtimeEdgeKeys) {
  assert(realizedRuntimeEdges.has(edge), `runtime edge 未在 production source 中实现: ${edge}`);
}

const edgeFixtures = await readJson('tools/quality/fixtures/edges/dependency-edges.json');
for (const fixture of edgeFixtures) {
  assert(
    classifyInternalEdge(fixture.from, fixture.to, fixture.surface) === fixture.expected,
    `dependency edge fixture 失败: ${JSON.stringify(fixture)}`,
  );
}

const prettierIgnore = await readFile(path.join(root, '.prettierignore'), 'utf8');
const prettierIgnoreLines = prettierIgnore.split(/\r?\n/u).filter(Boolean);
assert(
  JSON.stringify(prettierIgnoreLines) === JSON.stringify([...canonicalIgnores, 'pnpm-lock.yaml']),
  '.prettierignore 必须精确匹配 canonicalIgnores + pnpm-lock.yaml',
);

const workspaceYaml = await readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
for (const failure of workspaceConfigurationFailures(workspaceYaml)) assert(false, failure);
const qualityWorkflow = await readFile(path.join(root, '.github/workflows/quality.yml'), 'utf8');
for (const failure of qualityWorkflowFailures(qualityWorkflow)) assert(false, failure);

const evidence = await readJson('tools/quality/starter-evidence/source-digests.json');
const expectedStarterPaths = [
  'components.json',
  'src/components/ui/button.tsx',
  'src/index.css',
  'src/lib/utils.ts',
];
const expectedGeneratedPaths = expectedStarterPaths.map((file) => `apps/web/${file}`);
assert(
  JSON.stringify(Object.keys(evidence.generatedSources).sort()) ===
    JSON.stringify(expectedGeneratedPaths.sort()),
  'starter generated source evidence path set 漂移',
);
assert(
  JSON.stringify(Object.keys(evidence.originalStarterSources).sort()) ===
    JSON.stringify(expectedStarterPaths.sort()),
  'starter original source evidence path set 漂移',
);
for (const [file, expectedDigest] of Object.entries(evidence.generatedSources)) {
  const actualDigest = domainSeparatedSha256(
    `tickdeck:starter-evidence:generated-source:v1:${file}`,
    await readFile(path.join(root, file)),
  );
  assert(
    /^sha256:[a-f0-9]{64}$/u.test(expectedDigest) && actualDigest === expectedDigest,
    `starter generated source digest 漂移: ${file}`,
  );
}
for (const [file, expectedDigest] of Object.entries(evidence.originalStarterSources)) {
  const actualDigest = domainSeparatedSha256(
    `tickdeck:starter-evidence:original-source:v1:${file}`,
    await readFile(path.join(root, `tools/quality/starter-evidence/original/${file}.source`)),
  );
  assert(actualDigest === expectedDigest, `starter original source digest 漂移: ${file}`);
}
const command = await readFile(
  path.join(root, 'tools/quality/starter-evidence/command.txt'),
  'utf8',
);
assert(command.includes('shadcn@4.19.0 create'), 'starter command 未锁定 shadcn@4.19.0');
assert(!command.includes('shadcn@latest'), 'starter command 禁止 shadcn@latest');
assert(
  domainSeparatedSha256('tickdeck:starter-evidence:command:v1', command) === evidence.commandSha256,
  'starter command digest 漂移',
);
const resolvedPreset = await readJson('tools/quality/starter-evidence/resolved-preset.json');
assert(
  canonicalJsonDigest('tickdeck:starter-evidence:resolved-preset:v1', resolvedPreset) ===
    evidence.presetSha256,
  'resolved preset digest 漂移',
);
const githubRulesetEvidence = await readJson('tools/quality/external-evidence/github-ruleset.json');
assert(
  canonicalJsonDigest('tickdeck:github-ruleset-evidence:v1', githubRulesetEvidence.ruleset) ===
    githubRulesetEvidence.rulesetResponseDigest,
  'GitHub ruleset evidence digest 漂移',
);
for (const failure of githubRulesetEvidenceFailures(githubRulesetEvidence)) assert(false, failure);

const lintStaged = await import(path.join(root, 'lint-staged.config.mjs'));
const fixtureFiles = [
  path.join(root, 'node_modules/ignored.ts'),
  path.join(root, 'apps/web/src/components/ui/button.tsx'),
  path.join(root, 'apps/web/src/index.css'),
  path.join(root, 'eslint.config.mjs'),
  path.join(root, 'pnpm-lock.yaml'),
];
const normalized = lintStaged.normalizeAuthoredFiles(fixtureFiles, { formatter: true });
assert(
  !normalized.some((file) => file.includes('node_modules')),
  'lint-staged 未过滤 ignored artifact',
);
assert(normalized.includes('apps/web/src/components/ui/button.tsx'), 'lint-staged 丢失 shadcn TSX');
assert(normalized.includes('apps/web/src/index.css'), 'lint-staged 丢失 Web CSS');
assert(normalized.includes('eslint.config.mjs'), 'lint-staged 丢失根 config');
assert(!normalized.includes('pnpm-lock.yaml'), 'lint-staged 不得格式化 pnpm-lock.yaml');
assert(
  lintStaged.default['**/*.rs'](['a.rs', 'b.rs']) === 'cargo fmt --all --check',
  'Rust staged task 必须 filename-free 且只返回一个命令',
);

for (const forbidden of [
  'packages/core/package.json',
  'packages/storage-sqlite/migrations',
  'apps/web/public/sw.js',
]) {
  if (forbidden === 'packages/core/package.json') continue;
  assert(!(await exists(forbidden)), `Story 1.1 禁止范围出现: ${forbidden}`);
}

if (failures.length > 0) {
  console.error(`workspace-check failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `workspace-check passed: ${expectedMembers.length} members, ${dependencyEdges.length} typed edges`,
  );
}

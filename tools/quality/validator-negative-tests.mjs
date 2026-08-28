import { execFile as execFileCallback } from 'node:child_process';
import { access, cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';

import { artifactProjectionFailures } from './build-projection-check.mjs';
import {
  buildPolicyFailures,
  ignoredPackageNames,
  inspectLifecyclePackage,
} from './dependency-build-check.mjs';
import { canonicalizeJson, domainSeparatedSha256 } from './digest.mjs';
import { generatedCheckFailures } from './generated-check.mjs';
import { commandsFor, quotePosixShellArgument } from '../../lint-staged.config.mjs';
import { unexpectedWarningLines } from './run-warning-free.mjs';
import {
  forbiddenCompilerOverrideFailures,
  githubRulesetEvidenceFailures,
  qualityWorkflowFailures,
  workspaceConfigurationFailures,
  workspacePolicyFailures,
} from './workspace-contract-checks.mjs';
import {
  canonicalIgnores,
  dependencyEdges,
  eslintRestrictedImports,
  internalPackageName,
  members,
  profiles,
  requiredLeafScripts,
} from './workspace-policy.mjs';
import { validateWitSeed } from '../component-compiler/scripts/check-wit.mjs';

const execFile = promisify(execFileCallback);
const root = path.resolve(import.meta.dirname, '../..');
const passed = [];

function assert(condition, label) {
  if (!condition) throw new Error(`negative validator did not fail closed: ${label}`);
  passed.push(label);
}

async function expectCommandFailure(command, args, options) {
  try {
    await execFile(command, args, options);
    return { failed: false, output: '' };
  } catch (error) {
    return { failed: true, output: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
}

assert(unexpectedWarningLines('all checks passed').length === 0, 'warning gate clean output');
for (const warning of [
  'Warning: simulated',
  '[WARN] simulated',
  '▲ Vite [plugin builtin:vite-reporter]',
  '│ (!) simulated chunk warning',
  'PLUGIN_TIMINGS',
]) {
  assert(unexpectedWarningLines(warning).length > 0, `warning gate rejects ${warning}`);
}
const warningGateProcess = await expectCommandFailure(
  process.execPath,
  [
    path.join(root, 'tools/quality/run-warning-free.mjs'),
    '--',
    process.execPath,
    '-e',
    "console.error('Warning: controlled-negative-fixture')",
  ],
  { cwd: root, env: { ...process.env, NO_COLOR: '1' } },
);
assert(warningGateProcess.failed, 'warning gate process exit');

const warningHangFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-warning-hang-'));
try {
  const marker = path.join(warningHangFixture, 'descendant-survived');
  const descendant = `setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'bad'), 400); setInterval(() => {}, 1000);`;
  const parent = `require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(descendant)}], { stdio: 'ignore' }); setInterval(() => {}, 1000);`;
  const started = performance.now();
  const result = await expectCommandFailure(
    process.execPath,
    [
      path.join(root, 'tools/quality/run-warning-free.mjs'),
      '--max-duration-ms=100',
      '--',
      process.execPath,
      '-e',
      parent,
    ],
    {
      cwd: warningHangFixture,
      env: process.env,
    },
  );
  assert(result.failed && performance.now() - started < 1_500, 'warning gate live deadline');
  await delay(600);
  const descendantSurvived = await access(marker).then(
    () => true,
    () => false,
  );
  assert(!descendantSurvived, 'warning gate terminates descendant process group');
} finally {
  await rm(warningHangFixture, { recursive: true, force: true });
}

const policy = { canonicalIgnores, dependencyEdges, members, profiles, requiredLeafScripts };
assert(workspacePolicyFailures(policy).length === 0, 'workspace contract positive control');
const memberDrift = structuredClone(policy);
delete memberDrift.members['apps/web'];
assert(workspacePolicyFailures(memberDrift).length > 0, 'workspace member drift');
const edgeDrift = structuredClone(policy);
edgeDrift.dependencyEdges[0][2] = 'test/dev';
assert(workspacePolicyFailures(edgeDrift).length > 0, 'workspace edge classification drift');
const profileDrift = structuredClone(policy);
profileDrift.profiles.web.rootDir = '.';
assert(workspacePolicyFailures(profileDrift).length > 0, 'workspace profile drift');
const leafDrift = structuredClone(policy);
leafDrift.requiredLeafScripts.pop();
assert(workspacePolicyFailures(leafDrift).length > 0, 'workspace leaf coverage drift');
const ignoreDrift = structuredClone(policy);
ignoreDrift.canonicalIgnores.pop();
assert(workspacePolicyFailures(ignoreDrift).length > 0, 'workspace canonical ignore drift');
assert(
  internalPackageName('@tickdeck/testkit/fixtures/deep') === '@tickdeck/testkit',
  'internal package subpath collector',
);
assert(
  JSON.stringify(eslintRestrictedImports).includes('@tickdeck/testkit/*'),
  'ESLint internal package subpath restriction',
);
assert(
  forbiddenCompilerOverrideFailures({ exactOptionalPropertyTypes: false }).includes(
    'exactOptionalPropertyTypes',
  ) && forbiddenCompilerOverrideFailures({ moduleResolution: 'Classic' }).length > 0,
  'leaf tsconfig inherited strict/profile override',
);

const workspaceSource = await readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
assert(
  workspaceConfigurationFailures(workspaceSource).length === 0,
  'workspace YAML positive control',
);
assert(
  workspaceConfigurationFailures(
    workspaceSource.replace("  - 'apps/*'", "  # - 'apps/*' comment-only bypass"),
  ).length > 0,
  'workspace YAML comment pseudo-member bypass',
);
assert(
  workspaceConfigurationFailures(`${workspaceSource}\nstrictDepBuilds: true\n`).length > 0,
  'workspace YAML duplicate key',
);
assert(
  workspaceConfigurationFailures(workspaceSource.replace("  - 'tools/*'\n", '')).length > 0,
  'workspace YAML member drift',
);
assert(
  workspaceConfigurationFailures(
    workspaceSource.replace("minimumReleaseAgeExclude:\n  - '@testing-library/react@16.3.3'\n", ''),
  ).length > 0,
  'workspace release-age exception removal',
);
assert(
  workspaceConfigurationFailures(
    workspaceSource.replace("'@testing-library/react@16.3.3'", "'@testing-library/react'"),
  ).length > 0,
  'workspace release-age exception generalization',
);
assert(
  workspaceConfigurationFailures(
    workspaceSource.replace(
      "  - '@testing-library/react@16.3.3'",
      "  - '@testing-library/react@16.3.3'\n  - 'eslint@10.0.0'",
    ),
  ).length > 0,
  'workspace release-age exception expansion',
);

const workflowSource = await readFile(path.join(root, '.github/workflows/quality.yml'), 'utf8');
assert(qualityWorkflowFailures(workflowSource).length === 0, 'quality workflow positive control');
assert(
  qualityWorkflowFailures(
    workflowSource.replace("branches: [main, 'codex/**']", 'branches: [main]'),
  ).length > 0,
  'quality workflow controlled branch trigger removal',
);
assert(
  qualityWorkflowFailures(workflowSource.replace("'codex/**'", "'**'")).length > 0,
  'quality workflow branch trigger broadening',
);
assert(
  qualityWorkflowFailures(workflowSource.replace('ubuntu-24.04', 'ubuntu-latest')).length > 0,
  'quality workflow runner drift',
);
assert(
  qualityWorkflowFailures(workflowSource.replace('11d5960a326750d5838078e36cf38b85af677262', 'v4'))
    .length > 0,
  'quality workflow action pin drift',
);

const rulesetEvidence = JSON.parse(
  await readFile(path.join(root, 'tools/quality/external-evidence/github-ruleset.json'), 'utf8'),
);
assert(
  githubRulesetEvidenceFailures(rulesetEvidence).length === 0,
  'ruleset evidence positive control',
);
const rulesetDrift = structuredClone(rulesetEvidence);
rulesetDrift.ruleset.conditions.ref_name.include = ['refs/heads/main'];
assert(githubRulesetEvidenceFailures(rulesetDrift).length > 0, 'ruleset default branch drift');
const bypassDrift = structuredClone(rulesetEvidence);
bypassDrift.ruleset.bypass_actors = [{ actor_id: 1 }];
assert(githubRulesetEvidenceFailures(bypassDrift).length > 0, 'ruleset bypass drift');

assert(
  buildPolicyFailures(new Set(['esbuild']), new Map(), new Set()).some((item) =>
    item.includes('未裁决'),
  ),
  'allowBuilds missing decision',
);
assert(
  buildPolicyFailures(new Set(['esbuild']), new Map([['esbuild', false]]), new Set()).some((item) =>
    item.includes('缺失阻断'),
  ),
  'allowBuilds blocked-set drift',
);
assert(
  ignoredPackageNames('Automatically ignored builds during installation:\n  None\n').size === 0,
  'pnpm ignored-builds empty-set marker',
);
assert(
  (await inspectLifecyclePackage('/virtual', async () =>
    JSON.stringify({ name: 'fixture', scripts: { install: 'node install.mjs' } }),
  )) === 'fixture',
  'lifecycle manifest positive control',
);
let malformedFailed = false;
try {
  await inspectLifecyclePackage('/virtual', async () => '{not-json');
} catch (error) {
  malformedFailed = /malformed package\.json/u.test(error.message);
}
assert(malformedFailed, 'malformed lifecycle package manifest');
let unreadableFailed = false;
try {
  await inspectLifecyclePackage('/virtual', async () => {
    throw Object.assign(new Error('permission denied'), { code: 'EACCES' });
  });
} catch (error) {
  unreadableFailed = error.code === 'EACCES';
}
assert(unreadableFailed, 'unreadable lifecycle package manifest');
assert(
  (await inspectLifecyclePackage('/virtual', async () => {
    throw Object.assign(new Error('not a package root'), { code: 'ENOENT' });
  })) === undefined,
  'irrelevant peer link without manifest',
);

assert(
  artifactProjectionFailures([
    {
      content: "import '@tickdeck/testkit';",
      path: 'apps/web/dist/assets/negative.js',
    },
  ]).length > 0,
  'production bundle rejects testkit',
);

const lockFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-lock-negative-'));
try {
  await cp(path.join(root, 'pnpm-workspace.yaml'), path.join(lockFixture, 'pnpm-workspace.yaml'));
  await cp(path.join(root, 'pnpm-lock.yaml'), path.join(lockFixture, 'pnpm-lock.yaml'));
  const rootManifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  rootManifest.devDependencies.eslint = '10.9.0';
  await writeFile(
    path.join(lockFixture, 'package.json'),
    `${JSON.stringify(rootManifest, null, 2)}\n`,
  );
  for (const directory of Object.keys(members)) {
    await mkdir(path.join(lockFixture, directory), { recursive: true });
    await cp(
      path.join(root, directory, 'package.json'),
      path.join(lockFixture, directory, 'package.json'),
    );
  }
  const childEnvironment = { ...process.env, HUSKY: '0' };
  delete childEnvironment.NO_COLOR;
  delete childEnvironment.FORCE_COLOR;
  const frozenInstall = await expectCommandFailure(
    'pnpm',
    ['install', '--lockfile-only', '--frozen-lockfile', '--ignore-scripts', '--offline'],
    { cwd: lockFixture, env: childEnvironment },
  );
  assert(
    frozenInstall.failed && /OUTDATED_LOCKFILE|frozen-lockfile/iu.test(frozenInstall.output),
    'frozen lock drift',
  );
} finally {
  await rm(lockFixture, { recursive: true, force: true });
}

const unregisteredFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-generated-negative-'));
try {
  const registry = path.join(unregisteredFixture, 'registry');
  await mkdir(path.join(unregisteredFixture, 'rogue/generated'), { recursive: true });
  await mkdir(registry);
  await writeFile(path.join(unregisteredFixture, 'rogue/generated/value.txt'), 'rogue');
  assert(
    (await generatedCheckFailures(unregisteredFixture, registry)).some((item) =>
      item.includes('未注册 generated root'),
    ),
    'unregistered generated root',
  );
} finally {
  await rm(unregisteredFixture, { recursive: true, force: true });
}

const generatedRootSymlinkFixture = await mkdtemp(
  path.join(os.tmpdir(), 'tickdeck-generated-root-symlink-'),
);
try {
  const registry = path.join(generatedRootSymlinkFixture, 'registry');
  await mkdir(path.join(generatedRootSymlinkFixture, 'rogue/target'), { recursive: true });
  await mkdir(registry);
  await symlink('target', path.join(generatedRootSymlinkFixture, 'rogue/generated'));
  assert(
    (await generatedCheckFailures(generatedRootSymlinkFixture, registry)).some((item) =>
      item.includes('generated root 不得是 symlink'),
    ),
    'generated root symlink',
  );
} finally {
  await rm(generatedRootSymlinkFixture, { recursive: true, force: true });
}

const generatedFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-generated-rebuild-'));
try {
  const registry = path.join(generatedFixture, 'registry');
  await mkdir(path.join(generatedFixture, 'apps/web/generated'), { recursive: true });
  await mkdir(registry);
  const generator = [
    "import { mkdir, readFile, writeFile } from 'node:fs/promises';",
    "await mkdir('apps/web/generated', { recursive: true });",
    "await writeFile('apps/web/generated/value.txt', await readFile('apps/web/input.txt'));",
  ].join('\n');
  const toolPath = 'apps/web/generator.mjs';
  await writeFile(path.join(generatedFixture, toolPath), generator);
  await writeFile(path.join(generatedFixture, 'apps/web/input.txt'), 'canonical-bytes');
  await writeFile(path.join(generatedFixture, 'apps/web/generated/value.txt'), 'canonical-bytes');
  const manifest = {
    schemaVersion: '1.0.0',
    owner: 'apps/web',
    inputs: [toolPath, 'apps/web/input.txt'],
    outputs: ['apps/web/generated/value.txt'],
    toolPath,
    toolDigest: domainSeparatedSha256(
      `tickdeck:generated-tool:v1:${toolPath}`,
      Buffer.from(generator, 'utf8'),
    ),
    command: [process.execPath, toolPath],
    consumers: ['apps/web'],
  };
  const manifestPath = path.join(registry, 'fixture.json');
  await writeFile(manifestPath, JSON.stringify(manifest));
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).length === 0,
    'generated rebuild positive control',
  );
  await writeFile(path.join(generatedFixture, 'apps/web/generated/value.txt'), 'byte-drift');
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('exact byte drift'),
    ),
    'generated exact byte drift',
  );
  await writeFile(path.join(generatedFixture, 'apps/web/generated/value.txt'), 'canonical-bytes');
  await writeFile(path.join(generatedFixture, 'apps/web/generated/extra.txt'), 'extra');
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('committed exact path drift'),
    ),
    'generated exact path drift',
  );
  await rm(path.join(generatedFixture, 'apps/web/generated/extra.txt'));

  await writeFile(path.join(generatedFixture, toolPath), `${generator}\n// drift`);
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('toolDigest'),
    ),
    'generated tool artifact digest drift',
  );
  await writeFile(path.join(generatedFixture, toolPath), generator);

  await writeFile(manifestPath, JSON.stringify({ ...manifest, owner: 'packages/unknown' }));
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('owner 不是已知 workspace'),
    ),
    'generated unknown owner',
  );
  await writeFile(manifestPath, JSON.stringify({ ...manifest, consumers: ['packages/testkit'] }));
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('未授权 build consumer'),
    ),
    'generated unauthorized consumer',
  );

  const symlinkInput = 'apps/web/symlink-input.txt';
  await symlink('input.txt', path.join(generatedFixture, symlinkInput));
  await writeFile(
    manifestPath,
    JSON.stringify({ ...manifest, inputs: [...manifest.inputs, symlinkInput] }),
  );
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('symlink'),
    ),
    'generated input symlink',
  );
  await rm(path.join(generatedFixture, symlinkInput));
  await writeFile(manifestPath, JSON.stringify(manifest));

  const output = path.join(generatedFixture, 'apps/web/generated/value.txt');
  await rm(output);
  await symlink('../../input.txt', output);
  assert(
    (await generatedCheckFailures(generatedFixture, registry)).some((item) =>
      item.includes('symlink'),
    ),
    'generated output symlink',
  );
  await rm(output);
  await writeFile(output, 'canonical-bytes');

  const marker = path.join(generatedFixture, 'generator-descendant-survived');
  const descendant = `setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'bad'), 400); setInterval(() => {}, 1000);`;
  const hangingGenerator = `import { spawn } from 'node:child_process'; spawn(process.execPath, ['-e', ${JSON.stringify(descendant)}], { stdio: 'ignore' }); setInterval(() => {}, 1000);`;
  await writeFile(path.join(generatedFixture, toolPath), hangingGenerator);
  await writeFile(
    manifestPath,
    JSON.stringify({
      ...manifest,
      toolDigest: domainSeparatedSha256(
        `tickdeck:generated-tool:v1:${toolPath}`,
        Buffer.from(hangingGenerator, 'utf8'),
      ),
    }),
  );
  const timeoutFailures = await generatedCheckFailures(generatedFixture, registry, {
    timeoutMs: 100,
  });
  assert(
    timeoutFailures.some((item) => item.includes('timeout')),
    'generated absolute timeout',
  );
  await delay(600);
  const generatorDescendantSurvived = await access(marker).then(
    () => true,
    () => false,
  );
  assert(!generatorDescendantSurvived, 'generated timeout terminates descendant process group');
} finally {
  await rm(generatedFixture, { recursive: true, force: true });
}

const styleFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-style-negative-'));
try {
  const css = path.join(styleFixture, 'unknown.css');
  await writeFile(css, '@unknown-contract value;\n');
  const stylelint = await expectCommandFailure(
    path.join(root, 'node_modules/.bin/stylelint'),
    [css, '--config', path.join(root, 'stylelint.config.mjs')],
    { cwd: root, env: process.env },
  );
  assert(stylelint.failed && /at-rule-no-unknown/u.test(stylelint.output), 'unknown CSS at-rule');
} finally {
  await rm(styleFixture, { recursive: true, force: true });
}

assert(canonicalizeJson({ z: 0, a: [2, 1] }) === '{"a":[2,1],"z":0}', 'RFC 8785 canonical order');
const sparseWithCompensatingKey = Array.from({ length: 2 });
sparseWithCompensatingKey[1] = 'value';
sparseWithCompensatingKey.extra = 'compensating-key';
let sparseRejected = false;
try {
  canonicalizeJson(sparseWithCompensatingKey);
} catch {
  sparseRejected = true;
}
assert(sparseRejected, 'RFC 8785 sparse array with compensating key');
const arrayWithExtra = ['value'];
arrayWithExtra.extra = 'not-json';
for (const [label, value] of [
  ['array extra property', arrayWithExtra],
  ['Date object', new Date()],
  ['Map object', new Map()],
  ['Set object', new Set()],
]) {
  let rejected = false;
  try {
    canonicalizeJson(value);
  } catch {
    rejected = true;
  }
  assert(rejected, `RFC 8785 rejects ${label}`);
}
assert(
  domainSeparatedSha256('tickdeck:test-a:v1', Buffer.from('same')) !==
    domainSeparatedSha256('tickdeck:test-b:v1', Buffer.from('same')),
  'digest domain separation',
);

assert(
  validateWitSeed(
    'package tickdeck:sandbox@0.0.0; /* import fake:cap; */ world tickdeck-sandbox { // export fake;\n}',
  ).length === 0,
  'WIT comments cannot create capabilities',
);
for (const body of [
  'import fake:cap;',
  'export run: func();',
  'include other;',
  'use fake.{thing};',
  'important-long-identifier: func();',
]) {
  assert(
    validateWitSeed(`package tickdeck:sandbox@0.0.0; world tickdeck-sandbox { ${body} }`).length >
      0,
    `WIT non-empty world rejects ${body}`,
  );
}
assert(
  validateWitSeed('package tickdeck:other@0.0.0; world tickdeck-sandbox {}').length > 0,
  'WIT package identity drift',
);

const shellQuoteFixture = await mkdtemp(path.join(os.tmpdir(), 'tickdeck-shell-quote-'));
try {
  const marker = path.join(shellQuoteFixture, 'command-executed');
  const malicious = `name with space ' \`touch ${marker}\` $(touch ${marker}) $HOME.ts`;
  const quoted = quotePosixShellArgument(malicious);
  const { stdout } = await execFile('/bin/sh', ['-c', `printf '%s' ${quoted}`]);
  assert(stdout === malicious, 'lint-staged POSIX quote round trip');
  assert(
    !(await access(marker).then(
      () => true,
      () => false,
    )),
    'lint-staged filename does not execute shell substitutions',
  );
  const absoluteFixture = path.join(root, 'apps/web/src', "name with space ' `tick` $().ts");
  const commands = commandsFor([absoluteFixture], ['eslint --fix --max-warnings 0'], {
    formatter: true,
  });
  assert(
    commands.length === 1 &&
      commands[0].includes("'apps/web/src/name with space '\\'' `tick` $().ts'") &&
      !commands[0].includes(root),
    'lint-staged malicious filename remains repo-relative',
  );
} finally {
  await rm(shellQuoteFixture, { recursive: true, force: true });
}

const starterEvidence = JSON.parse(
  await readFile(path.join(root, 'tools/quality/starter-evidence/source-digests.json'), 'utf8'),
);
assert(
  !('originalPresetSha256' in starterEvidence),
  'starter evidence omits redundant original preset digest',
);

console.log(`validator-negative-tests passed: cases=${passed.length}`);

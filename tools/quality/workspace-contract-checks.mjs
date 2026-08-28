const expectedMembers = {
  'apps/web': { name: '@tickdeck/web', profile: 'web' },
  'apps/desktop': { name: '@tickdeck/desktop', profile: 'node-config-only' },
  'apps/server': { name: '@tickdeck/server', profile: 'node-runtime' },
  'apps/worker': { name: '@tickdeck/worker', profile: 'node-runtime' },
  'packages/contracts': { name: '@tickdeck/contracts', profile: 'neutral-shared' },
  'packages/core': { name: '@tickdeck/core', profile: 'neutral-shared' },
  'packages/policies': { name: '@tickdeck/policies', profile: 'neutral-shared' },
  'packages/storage-sqlite': { name: '@tickdeck/storage-sqlite', profile: 'node-runtime' },
  'packages/artifact-fs': { name: '@tickdeck/artifact-fs', profile: 'node-runtime' },
  'packages/connectors-core': { name: '@tickdeck/connectors-core', profile: 'node-runtime' },
  'packages/connectors-official': {
    name: '@tickdeck/connectors-official',
    profile: 'node-runtime',
  },
  'packages/models': { name: '@tickdeck/models', profile: 'node-runtime' },
  'packages/notifications': { name: '@tickdeck/notifications', profile: 'node-runtime' },
  'packages/agent-mastra': { name: '@tickdeck/agent-mastra', profile: 'node-runtime' },
  'packages/testkit': { name: '@tickdeck/testkit', profile: 'node-runtime' },
  'tools/component-compiler': {
    name: '@tickdeck/component-compiler',
    profile: 'node-runtime',
  },
};

const expectedEdges = [
  ['apps/web', 'packages/contracts', 'runtime'],
  ['apps/server', 'packages/core', 'runtime'],
  ['apps/server', 'packages/contracts', 'runtime'],
  ['apps/server', 'packages/policies', 'runtime'],
  ['apps/server', 'packages/storage-sqlite', 'runtime'],
  ['apps/server', 'packages/artifact-fs', 'runtime'],
  ['apps/worker', 'packages/core', 'runtime'],
  ['apps/worker', 'packages/contracts', 'runtime'],
  ['apps/worker', 'packages/policies', 'runtime'],
  ['apps/worker', 'packages/connectors-core', 'runtime'],
  ['apps/worker', 'packages/connectors-official', 'runtime'],
  ['apps/worker', 'packages/models', 'runtime'],
  ['apps/worker', 'packages/notifications', 'runtime'],
  ['apps/worker', 'packages/agent-mastra', 'runtime'],
  ['packages/storage-sqlite', 'packages/core', 'runtime'],
  ['packages/artifact-fs', 'packages/core', 'runtime'],
  ['packages/connectors-core', 'packages/core', 'runtime'],
  ['packages/connectors-official', 'packages/connectors-core', 'runtime'],
  ['packages/models', 'packages/connectors-core', 'runtime'],
  ['packages/notifications', 'packages/connectors-core', 'runtime'],
  ['packages/agent-mastra', 'packages/core', 'runtime'],
  ['packages/testkit', 'packages/core', 'runtime'],
  ['packages/testkit', 'packages/contracts', 'runtime'],
  ['packages/testkit', 'packages/policies', 'runtime'],
  ['packages/connectors-official', 'packages/testkit', 'build/codegen'],
  ['tools/component-compiler', 'wit/tickdeck-sandbox', 'build/codegen'],
  ['apps/server', 'packages/testkit', 'test/dev'],
  ['apps/worker', 'packages/testkit', 'test/dev'],
  ['packages/storage-sqlite', 'packages/testkit', 'test/dev'],
  ['packages/artifact-fs', 'packages/testkit', 'test/dev'],
  ['packages/connectors-core', 'packages/testkit', 'test/dev'],
  ['packages/connectors-official', 'packages/testkit', 'test/dev'],
  ['packages/models', 'packages/testkit', 'test/dev'],
  ['packages/notifications', 'packages/testkit', 'test/dev'],
  ['packages/agent-mastra', 'packages/testkit', 'test/dev'],
  ['tools/component-compiler', 'packages/testkit', 'test/dev'],
];

const expectedProfiles = {
  web: { extends: '../../tsconfig.web.json', rootDir: 'src' },
  'node-runtime': { extends: '../../tsconfig.node.json', rootDir: 'src' },
  'neutral-shared': { extends: '../../tsconfig.neutral.json', rootDir: 'src' },
  'node-config-only': { extends: '../../tsconfig.node-config.json', rootDir: '.' },
};

const expectedLeafScripts = ['typecheck', 'build', 'test:unit', 'codegen:check'];

function stableEntries(value) {
  return Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right));
}

function edgeKeys(edges) {
  return edges.map((edge) => edge.join('\u0000')).toSorted();
}

export function workspacePolicyFailures(policy) {
  const failures = [];
  if (
    JSON.stringify(stableEntries(policy.members)) !== JSON.stringify(stableEntries(expectedMembers))
  ) {
    failures.push('workspace policy members 必须精确匹配 16-member S0-V contract');
  }
  if (
    JSON.stringify(edgeKeys(policy.dependencyEdges)) !== JSON.stringify(edgeKeys(expectedEdges))
  ) {
    failures.push('workspace policy edges 必须精确匹配 36 条 typed edge 及分类');
  }
  if (
    JSON.stringify(stableEntries(policy.profiles)) !==
    JSON.stringify(stableEntries(expectedProfiles))
  ) {
    failures.push('workspace policy profiles 必须精确匹配四类 production profile');
  }
  if (JSON.stringify(policy.requiredLeafScripts) !== JSON.stringify(expectedLeafScripts)) {
    failures.push('workspace policy leaf scripts 不得缩短、改名或重排');
  }
  if (JSON.stringify(policy.canonicalIgnores) !== JSON.stringify(expectedCanonicalIgnores)) {
    failures.push('workspace policy canonicalIgnores 必须精确匹配 S0-V contract');
  }
  return failures;
}

const expectedWorkspaceConfiguration = {
  packages: ['apps/*', 'packages/*', 'tools/*'],
  includeWorkspaceRoot: false,
  strictDepBuilds: true,
  dangerouslyAllowAllBuilds: false,
  nodeOptions: '--max-old-space-size=4096',
  minimumReleaseAgeExclude: ['@testing-library/react@16.3.3'],
  allowBuilds: { esbuild: true },
};

function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableJson(item)]),
    );
  }
  return value;
}

export function workspaceConfigurationFailures(source) {
  let document;
  try {
    document = parseDocument(source, { schema: 'core', uniqueKeys: true });
  } catch (error) {
    return [`pnpm-workspace.yaml 解析失败: ${error.message}`];
  }
  if (document.errors.length > 0) {
    return [
      `pnpm-workspace.yaml 解析失败: ${document.errors.map((error) => error.message).join(';')}`,
    ];
  }
  const actual = document.toJS();
  return JSON.stringify(stableJson(actual)) ===
    JSON.stringify(stableJson(expectedWorkspaceConfiguration))
    ? []
    : ['pnpm-workspace.yaml members/safety contract 漂移'];
}

const inheritedStrictProfileOptions = [
  'target',
  'lib',
  'module',
  'moduleResolution',
  'strict',
  'noUncheckedIndexedAccess',
  'exactOptionalPropertyTypes',
  'useUnknownInCatchVariables',
  'noUncheckedSideEffectImports',
  'verbatimModuleSyntax',
  'isolatedModules',
  'skipLibCheck',
  'forceConsistentCasingInFileNames',
  'declaration',
  'declarationMap',
  'sourceMap',
  'composite',
  'jsx',
  'noEmit',
  'allowJs',
  'checkJs',
];

export function forbiddenCompilerOverrideFailures(
  compilerOptions,
  { desktopNarrowing = false } = {},
) {
  return inheritedStrictProfileOptions.filter(
    (option) =>
      option in compilerOptions &&
      !(desktopNarrowing && ['allowJs', 'checkJs', 'noEmit'].includes(option)),
  );
}

const qualityActionPins = [
  'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
  'pnpm/action-setup@b906affcce14559ad1aafd4ab0e942779e9f58b1',
  'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020',
  'dtolnay/rust-toolchain@6c977a6ca4077a0ceb28ffbe03f59d46e9ac8772',
];

export function qualityWorkflowFailures(source) {
  const document = parseDocument(source, { schema: 'core', uniqueKeys: true });
  if (document.errors.length > 0) return ['quality workflow YAML 无法严格解析'];
  const workflow = document.toJS();
  const jobs = workflow?.jobs;
  if (!jobs || typeof jobs !== 'object') return ['quality workflow 缺少 jobs'];
  const expectedTriggers = {
    pull_request: null,
    push: { branches: ['main', 'codex/**'] },
  };
  if (JSON.stringify(workflow?.on) !== JSON.stringify(expectedTriggers)) {
    return ['quality workflow 仅允许 pull_request、main 与 codex/** push 触发'];
  }
  const expectedContexts = ['build', 'format-check', 'lint', 'test', 'typecheck'];
  if (JSON.stringify(Object.keys(jobs).sort()) !== JSON.stringify(expectedContexts)) {
    return ['quality workflow 必须保持五个 exact contexts'];
  }
  const failures = [];
  for (const [name, job] of Object.entries(jobs)) {
    if (job?.['runs-on'] !== 'ubuntu-24.04') failures.push(`${name}: runner 未固定 ubuntu-24.04`);
    const uses = (job?.steps ?? []).flatMap((step) =>
      typeof step?.uses === 'string' ? [step.uses] : [],
    );
    if (JSON.stringify(uses) !== JSON.stringify(qualityActionPins)) {
      failures.push(`${name}: action full SHA pins 漂移`);
    }
  }
  return failures;
}

export function githubRulesetEvidenceFailures(evidence) {
  const ruleset = evidence?.ruleset;
  const requiredStatusRule = ruleset?.rules?.[0];
  const contexts = requiredStatusRule?.parameters?.required_status_checks?.map(
    (check) => check.context,
  );
  return evidence?.repository === 'Morilence/TickDeck' &&
    evidence?.visibility === 'public' &&
    evidence?.query === 'GET /repos/Morilence/TickDeck/rulesets/21725853' &&
    ruleset?.id === 21725853 &&
    ruleset?.name === 'Story 1.1 required quality contexts' &&
    ruleset?.enforcement === 'active' &&
    ruleset?.target === 'branch' &&
    ruleset?.source_type === 'Repository' &&
    ruleset?.source === 'Morilence/TickDeck' &&
    JSON.stringify(ruleset?.conditions?.ref_name) ===
      JSON.stringify({ exclude: [], include: ['~DEFAULT_BRANCH'] }) &&
    ruleset?.rules?.length === 1 &&
    requiredStatusRule?.type === 'required_status_checks' &&
    requiredStatusRule?.parameters?.strict_required_status_checks_policy === true &&
    requiredStatusRule?.parameters?.do_not_enforce_on_create === true &&
    JSON.stringify(contexts) ===
      JSON.stringify(['lint', 'format-check', 'typecheck', 'build', 'test']) &&
    JSON.stringify(ruleset?.bypass_actors) === '[]' &&
    ruleset?.current_user_can_bypass === 'never' &&
    ruleset?._links?.self?.href ===
      'https://api.github.com/repos/Morilence/TickDeck/rulesets/21725853' &&
    ruleset?._links?.html?.href === 'https://github.com/Morilence/TickDeck/rules/21725853'
    ? []
    : ['GitHub ruleset archived evidence contract 漂移'];
}

export const compilerProfileContract = {
  'tsconfig.base.json': {
    extends: undefined,
    compilerOptions: {
      strict: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      useUnknownInCatchVariables: true,
      noUncheckedSideEffectImports: true,
      verbatimModuleSyntax: true,
      isolatedModules: true,
      skipLibCheck: false,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      composite: true,
    },
  },
  'tsconfig.web.json': {
    extends: './tsconfig.base.json',
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      moduleResolution: 'Bundler',
      types: ['vite/client'],
      jsx: 'react-jsx',
      noEmit: true,
    },
  },
  'tsconfig.node.json': {
    extends: './tsconfig.base.json',
    compilerOptions: {
      target: 'ES2023',
      lib: ['ES2023'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      types: ['node'],
    },
  },
  'tsconfig.neutral.json': {
    extends: './tsconfig.base.json',
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      types: [],
    },
  },
  'tsconfig.node-config.json': {
    extends: './tsconfig.base.json',
    compilerOptions: {
      target: 'ES2023',
      lib: ['ES2023'],
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      types: ['node'],
      rootDir: '.',
      allowJs: true,
      checkJs: true,
      noEmit: true,
    },
  },
  'tsconfig.test.node.json': {
    extends: './tsconfig.node.json',
    compilerOptions: {
      types: ['node', 'vitest/globals'],
      noEmit: true,
      composite: false,
      declaration: false,
      declarationMap: false,
      sourceMap: false,
    },
  },
  'tsconfig.test.web.json': {
    extends: './tsconfig.web.json',
    compilerOptions: {
      lib: ['ES2022', 'DOM', 'DOM.Iterable', 'ESNext.Disposable'],
      types: ['vite/client', 'vitest/globals'],
      noEmit: true,
      composite: false,
      declaration: false,
      declarationMap: false,
      sourceMap: false,
    },
  },
};
import { parseDocument } from 'yaml';

const expectedCanonicalIgnores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/target/**',
  '**/.vite/**',
  '**/storybook-static/**',
  '**/playwright-report/**',
  '**/test-results/**',
  '**/generated/**',
  '_bmad/**',
  '_bmad-output/**',
  '.agents/**',
  '.playwright-cli/**',
];

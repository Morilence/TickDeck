export const stage = 'S0-V';

export const canonicalIgnores = [
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

export const members = {
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

export const dependencyEdges = [
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

export const profiles = {
  web: { extends: '../../tsconfig.web.json', rootDir: 'src' },
  'node-runtime': { extends: '../../tsconfig.node.json', rootDir: 'src' },
  'neutral-shared': { extends: '../../tsconfig.neutral.json', rootDir: 'src' },
  'node-config-only': { extends: '../../tsconfig.node-config.json', rootDir: '.' },
};

export const requiredLeafScripts = ['typecheck', 'build', 'test:unit', 'codegen:check'];

const memberNames = Object.fromEntries(
  Object.entries(members).map(([directory, definition]) => [directory, definition.name]),
);
const allInternalNames = Object.values(memberNames);

function targetsFor(source, edgeClass) {
  return dependencyEdges
    .filter(([from, , classification]) => from === source && classification === edgeClass)
    .map(([, to]) => memberNames[to])
    .filter((value) => value !== undefined);
}

function restrictedRule(allowed) {
  const denied = allInternalNames.filter((name) => !allowed.includes(name));
  const message = '该 workspace 依赖边未获 workspace-policy 授权。';
  return [
    'error',
    {
      paths: denied.map((name) => ({ name, message })),
      patterns: denied.map((name) => ({ group: [`${name}/*`], message })),
    },
  ];
}

export const eslintRestrictedImports = Object.keys(members).flatMap((directory) => {
  const runtime = targetsFor(directory, 'runtime');
  const test = [...runtime, ...targetsFor(directory, 'test/dev')];
  const build = [...runtime, ...targetsFor(directory, 'build/codegen')];
  return [
    {
      files: [`${directory}/src/**/*.{ts,tsx,mts,cts}`],
      ignores: [`${directory}/src/**/*.test.{ts,tsx,mts,cts}`],
      rules: { 'no-restricted-imports': restrictedRule(runtime) },
    },
    {
      files: [
        `${directory}/src/**/*.test.{ts,tsx,mts,cts}`,
        `${directory}/src/stories/**/*.{ts,tsx,mts,cts}`,
        `${directory}/tests/**/*.{ts,tsx,mts,cts}`,
      ],
      rules: { 'no-restricted-imports': restrictedRule(test) },
    },
    {
      files: [
        `${directory}/{scripts,fixtures,config}/**/*.{ts,tsx,mts,cts,js,mjs,cjs}`,
        `${directory}/*.config.{ts,tsx,mts,cts,js,mjs,cjs}`,
        `${directory}/.storybook/**/*.{ts,tsx,mts,cts,js,mjs,cjs}`,
      ],
      rules: { 'no-restricted-imports': restrictedRule(build) },
    },
  ];
});

eslintRestrictedImports.push({
  files: ['*.config.{ts,tsx,mts,cts,js,mjs,cjs}'],
  rules: { 'no-restricted-imports': restrictedRule([]) },
});

export function internalPackageName(specifier) {
  return specifier.match(/^(@tickdeck\/[^/]+)(?:\/.*)?$/u)?.[1];
}

export function classifyInternalEdge(from, to, surface) {
  const possible = dependencyEdges.filter(([source, target]) => source === from && target === to);
  if (surface === 'production') {
    return possible.some(([, , classification]) => classification === 'runtime')
      ? 'runtime'
      : 'denied';
  }
  if (surface === 'test') {
    const edge = possible.find(([, , classification]) =>
      ['runtime', 'test/dev'].includes(classification),
    );
    return edge?.[2] ?? 'denied';
  }
  if (surface === 'build') {
    const edge = possible.find(([, , classification]) =>
      ['runtime', 'build/codegen'].includes(classification),
    );
    return edge?.[2] ?? 'denied';
  }
  return 'denied';
}

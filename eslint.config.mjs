import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { canonicalIgnores, eslintRestrictedImports } from './tools/quality/workspace-policy.mjs';

const nodeTypeScriptFiles = [
  '*.{config,setup}.{ts,tsx,mts,cts}',
  'apps/*/*.config.{ts,tsx,mts,cts}',
  'apps/*/.storybook/**/*.{ts,tsx,mts,cts}',
  'apps/{server,worker}/**/*.{ts,tsx,mts,cts}',
  'packages/{storage-sqlite,artifact-fs,connectors-core,connectors-official,models,notifications,agent-mastra,testkit}/**/*.{ts,tsx,mts,cts}',
  'tools/component-compiler/**/*.{ts,tsx,mts,cts}',
];

export default tseslint.config(
  { ignores: canonicalIgnores },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: globals.node,
    },
  },
  ...tseslint.configs.strictTypeChecked,
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.node-config.json',
          './apps/*/tsconfig.json',
          './apps/*/tsconfig.test.json',
          './apps/web/tsconfig.config.json',
          './packages/*/tsconfig.json',
          './packages/*/tsconfig.test.json',
          './tools/*/tsconfig.json',
          './tools/*/tsconfig.test.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-confusing-void-expression': 'off',
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.flat.recommended.rules,
  },
  {
    files: nodeTypeScriptFiles,
    languageOptions: { globals: globals.node },
  },
  {
    files: [
      '**/*.test.{ts,tsx,mts,cts}',
      '**/tests/**/*.{ts,tsx,mts,cts}',
      'apps/web/src/stories/**/*.{ts,tsx}',
    ],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  ...eslintRestrictedImports,
  eslintConfigPrettier,
);

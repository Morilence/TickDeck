import path from 'node:path';

import { canonicalIgnores } from './tools/quality/workspace-policy.mjs';

const repositoryRoot = import.meta.dirname;

export function toRepositoryRelativePosix(file) {
  return path.relative(repositoryRoot, file).split(path.sep).join('/');
}

function matchesIgnore(file, ignore) {
  const normalized = file.replaceAll('\\', '/');
  if (ignore.endsWith('/**')) {
    const directory = ignore.slice(0, -3).replace(/^\*\*\//u, '');
    return (
      normalized === directory ||
      normalized.includes(`/${directory}/`) ||
      normalized.startsWith(`${directory}/`)
    );
  }
  return normalized === ignore || normalized.endsWith(`/${ignore}`);
}

export function normalizeAuthoredFiles(files, { formatter = false } = {}) {
  return files
    .map(toRepositoryRelativePosix)
    .filter((file) => !canonicalIgnores.some((ignore) => matchesIgnore(file, ignore)))
    .filter((file) => !(formatter && file === 'pnpm-lock.yaml'));
}

export function quotePosixShellArgument(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

export function quoteFiles(files) {
  return files.map(quotePosixShellArgument).join(' ');
}

export function commandsFor(files, commands, options) {
  const normalized = normalizeAuthoredFiles(files, options);
  if (normalized.length === 0) {
    return [];
  }
  const argumentsList = quoteFiles(normalized);
  return commands.map((command) => `${command} ${argumentsList}`);
}

export default {
  '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}': (files) =>
    commandsFor(files, ['eslint --fix --max-warnings 0', 'prettier --write'], { formatter: true }),
  'apps/web/**/*.{css,pcss}': (files) =>
    commandsFor(files, ['prettier --write', 'stylelint --fix --max-warnings 0'], {
      formatter: true,
    }),
  '**/*.{json,jsonc,md,mdx,yaml,yml,html}': (files) =>
    commandsFor(files, ['prettier --write'], { formatter: true }),
  '**/*.rs': () => 'cargo fmt --all --check',
};

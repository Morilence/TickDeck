import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '../..');
const outputRoot = path.join(root, 'apps/web/storybook-static');

async function javascriptFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await javascriptFiles(absolute)));
    else if (entry.name.endsWith('.js')) files.push(absolute);
  }
  return files;
}

function budgetFor(relativePath) {
  if (/^assets\/AppShell\.stories-/u.test(relativePath)) return 100_000;
  if (/^assets\/axe-/u.test(relativePath)) return 650_000;
  if (/^assets\/iframe-/u.test(relativePath)) return 1_200_000;
  if (relativePath === 'sb-manager/globals-runtime.js') return 3_500_000;
  if (relativePath === 'sb-manager/runtime.js') return 1_400_000;
  if (relativePath === 'sb-addons/storybook-core-server-presets-0/common-manager-bundle.js') {
    return 550_000;
  }
  return 500_000;
}

const files = await javascriptFiles(outputRoot);
const measured = await Promise.all(
  files.map(async (file) => ({
    bytes: (await stat(file)).size,
    path: path.relative(outputRoot, file).split(path.sep).join('/'),
  })),
);
const failures = measured.filter((item) => item.bytes > budgetFor(item.path));
const productStory = measured.find((item) => /^assets\/AppShell\.stories-/u.test(item.path));

if (!productStory) failures.push({ bytes: 0, path: 'missing AppShell story chunk' });
if (failures.length > 0) {
  console.error('storybook-bundle-check failed');
  for (const failure of failures) {
    console.error(
      `- ${failure.path}: ${failure.bytes} bytes (budget ${budgetFor(failure.path)} bytes)`,
    );
  }
  process.exitCode = 1;
} else {
  const largest = measured.toSorted((left, right) => right.bytes - left.bytes)[0];
  console.log(
    `storybook-bundle-check passed: files=${measured.length} product=${productStory.bytes}B largest=${largest.path}:${largest.bytes}B`,
  );
}

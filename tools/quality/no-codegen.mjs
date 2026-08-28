import { stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '../..');
const owner = process.argv[2];
if (!owner) throw new Error('no-codegen requires an owner workspace path');

try {
  await stat(path.join(root, owner, 'generated'));
  throw new Error(`${owner} 不得在 Story 1.1 提交 generated root`);
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    console.log(`${owner}: no generated output (expected for S0-V structural seed)`);
  } else {
    throw error;
  }
}

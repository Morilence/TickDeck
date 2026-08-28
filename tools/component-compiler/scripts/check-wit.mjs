import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const witPath = path.resolve(import.meta.dirname, '../../../wit/tickdeck-sandbox/world.wit');

function stripWitComments(source) {
  let output = '';
  let index = 0;
  let blockDepth = 0;
  while (index < source.length) {
    if (source.startsWith('/*', index)) {
      blockDepth += 1;
      index += 2;
      continue;
    }
    if (blockDepth > 0 && source.startsWith('*/', index)) {
      blockDepth -= 1;
      index += 2;
      continue;
    }
    if (blockDepth > 0) {
      index += 1;
      continue;
    }
    if (source.startsWith('//', index)) {
      const lineEnd = source.indexOf('\n', index + 2);
      index = lineEnd === -1 ? source.length : lineEnd + 1;
      output += ' ';
      continue;
    }
    output += source[index];
    index += 1;
  }
  if (blockDepth !== 0) throw new TypeError('WIT seed contains unterminated block comment');
  return output;
}

export function validateWitSeed(source) {
  const semantic = stripWitComments(source).trim();
  if (
    !/^package\s+tickdeck\s*:\s*sandbox\s*@\s*0\.0\.0\s*;\s*world\s+tickdeck-sandbox\s*\{\s*\}$/u.test(
      semantic,
    )
  ) {
    return ['WIT seed 必须精确声明 package tickdeck:sandbox@0.0.0 与空 world tickdeck-sandbox'];
  }
  return [];
}

async function run() {
  const failures = validateWitSeed(await readFile(witPath, 'utf8'));
  if (failures.length > 0) throw new Error(failures.join('; '));
  console.log('WIT seed check passed: exact empty world, no guest capability registered');
}

if (process.argv[1] === import.meta.filename) await run();

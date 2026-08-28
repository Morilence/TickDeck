import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { probeTypeScriptSource } from './index.js';

it('probes only the locked TypeScript compiler API without claiming Component support', () => {
  expect(probeTypeScriptSource('const value: string = "S0-V";')).toEqual([]);
  expect(upstreamSeeds).toHaveLength(3);
});

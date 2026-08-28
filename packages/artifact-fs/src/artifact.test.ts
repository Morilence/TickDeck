import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('remains a filesystem-free structural adapter', () => {
  expect(structuralSeed).toContain('@tickdeck/core:S0-V');
  expect(upstreamSeeds).toContain('@tickdeck/contracts:S0-V');
});

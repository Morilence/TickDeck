import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('does not register notification delivery', () => {
  expect(structuralSeed).toContain('@tickdeck/connectors-core:S0-V');
  expect(upstreamSeeds).toContain('@tickdeck/core:S0-V');
});

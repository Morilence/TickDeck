import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('does not register a connector runtime', () => {
  expect(structuralSeed).toContain('@tickdeck/core:S0-V');
  expect(upstreamSeeds).toHaveLength(3);
});

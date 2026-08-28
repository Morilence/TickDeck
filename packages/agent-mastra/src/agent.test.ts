import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('does not install Mastra or register Agent tools', () => {
  expect(structuralSeed).toContain('@tickdeck/core:S0-V');
  expect(upstreamSeeds).toContain('@tickdeck/policies:S0-V');
});

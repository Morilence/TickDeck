import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('does not install or qualify a model provider', () => {
  expect(structuralSeed).toContain('@tickdeck/connectors-core:S0-V');
  expect(upstreamSeeds).toHaveLength(3);
});

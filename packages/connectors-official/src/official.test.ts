import { upstreamSeeds } from '@tickdeck/testkit';
import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('does not advertise an official connector', () => {
  expect(structuralSeed).toContain('@tickdeck/connectors-core:S0-V');
  expect(upstreamSeeds).toContain('@tickdeck/policies:S0-V');
});

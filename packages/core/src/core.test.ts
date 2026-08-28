import { expect, it } from 'vitest';

import { structuralSeed } from './index.js';

it('keeps the core as a capability-free structural seed', () => {
  expect(structuralSeed).toBe('@tickdeck/core:S0-V');
});

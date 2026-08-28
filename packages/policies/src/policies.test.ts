import { expect, it } from 'vitest';

import { isS0VStage } from './index.js';

it('does not accept a future stage in the structural shell', () => {
  expect(isS0VStage('S0-V')).toBe(true);
  expect(isS0VStage('S1')).toBe(false);
});

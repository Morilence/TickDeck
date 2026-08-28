import { expect, it } from 'vitest';

import { forbiddenFutureNavigation, hasOnlyS0VNavigation } from './shell-contract.js';

it('allows only the current runtime-health shell surface', () => {
  expect(hasOnlyS0VNavigation(['runtime-health'])).toBe(true);
  expect(hasOnlyS0VNavigation(['runtime-health', 'agent'])).toBe(false);
  expect(forbiddenFutureNavigation).not.toContain('runtime-health');
});

import { expect, it } from 'vitest';

import { desktopLifecycle } from './tauri.lifecycle.config.js';

it('does not create a second renderer or domain channel', () => {
  expect(desktopLifecycle.domainIpc).toBe(false);
  expect(desktopLifecycle.updaterNetwork).toBe(false);
});

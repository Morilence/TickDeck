import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/tests',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:43117',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm start:test -- --server-port 43117',
    url: 'http://127.0.0.1:43117/api/v1/health',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: ['**/*.test.ts'], // Allow running any test file directly

  retries: 0, // ✅ must be here (top-level)

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: null, // real browser window size
    launchOptions: {
      args: ['--start-maximized', "--force-device-scale-factor=0.98"],
    },
  },
});

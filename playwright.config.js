// @ts-check
import { defineConfig, devices } from '@playwright/test';
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env' });
if (!fs.existsSync('.env') && fs.existsSync('.env.example')) {
  dotenv.config({ path: '.env.example' });
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

     baseURL: process.env.BASE_URL || 'https://stage.finspectors.ai',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    viewport : process.env.CI ? { width: 1920, height: 1080 } : { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    headless: false,
  },



  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    //   {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     // 'msedge' points to the branded version of Edge on your machine
    //     channel: 'msedge', 
    //   }
    // }
  
  ],

});


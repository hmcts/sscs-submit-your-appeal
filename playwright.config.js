/* eslint-disable */
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 3, // Set the number of retries for all projects

  timeout: 8 * 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },

  /* Opt out of parallel tests on CI. */
  workers: process.env.FUNCTIONAL_TESTS_WORKERS_COUNT ? 5 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'MobileChrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'MobileSafari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'MicrosoftEdge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});

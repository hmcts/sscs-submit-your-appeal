// playwright.config.js
/* eslint-disable no-process-env */
/* eslint-disable no-sync */
const { devices } = require("playwright");
const testChunks = process.env.CHUNKS || 1;

module.exports = {
  testDir: './',
  outputDir: process.env.E2E_OUTPUT_DIR || './functional-output',
  expect: {
    timeout: 10 * 1000
  },
  timeout: 90000,
  workers: parseInt(testChunks), // Parallel chunks
  retries: 5, // Set retries as per requirement
  fullyParallel: true,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: process.env.E2E_OUTPUT_DIR || './functional-output',
        open: 'never'
      }
    ]
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
    baseURL: process.env.TEST_URL || 'https://benefit-appeal.aat.platform.hmcts.net/',
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    browserName: 'chromium',
    headless: process.env.SHOW_BROWSER_WINDOW !== 'true',
    viewport: { width: 1280, height: 960 },
    bypassCSP: true,
    ignoreHTTPSErrors: true,
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  name: 'Submit Your Appeal Tests'
};

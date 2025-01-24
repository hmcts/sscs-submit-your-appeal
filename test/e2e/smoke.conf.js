// playwright.config.js
/* eslint-disable no-process-env */
const config = require('config');

module.exports = {
  testDir: './smoke', // Directory for smoke test files
  outputDir: process.env.E2E_OUTPUT_DIR || config.get('e2e.smokeOutputDir'),
  timeout: parseInt(config.get('e2e.waitForTimeout').toString()),
  retries: 0, // Adjust if you want to retry failed tests
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: './smoke-output',
        open: 'never'
      }
    ]
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: true,
        viewport: { width: 1000, height: 1000 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
        trace: 'on',
        baseURL: process.env.TEST_URL || config.get('e2e.frontendUrl'),
        launchOptions: {
          args: [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--allow-running-insecure-content',
            '--ignore-certificate-errors'
          ]
        }
      }
    }
  ],
  use: {
    baseURL: process.env.TEST_URL || config.get('e2e.frontendUrl'),
    actionTimeout: parseInt(config.get('e2e.waitForAction').toString()),
    navigationTimeout: 60000
  },
  globalSetup: require.resolve('./global-smoke-setup'),
  globalTeardown: require.resolve('./global-smoke-teardown'),
  name: 'Smoke test - Submit Your Appeal'
};

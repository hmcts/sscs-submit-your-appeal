// playwright.config.js
/* eslint-disable no-process-env */
/* eslint-disable no-sync */
import { defineConfig, devices } from '@playwright/test';

const getE2eTestTags = (process.env.E2E_TEST_TAGS || '@functional')
  .split(',')
  .map(tag => new RegExp(tag.trim()));

module.exports = defineConfig({
  testDir: process.env.E2E_TEST_DIR || './',
  outputDir: process.env.E2E_OUTPUT_DIR || './functional-output',
  grep: getE2eTestTags,
  expect: {
    timeout: 10 * 1000
  },
  timeout: 90000,
  workers: parseInt(process.env.CHUNKS) || 1, // Parallel chunks
  retries: parseInt(process.env.RETRIES) || 10, // Set retries as per requirement
  fullyParallel: true,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: process.env.E2E_REPORT_DIR || './functional-report',
        open: 'never'
      }
    ]
  ],
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' }
    // },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
    baseURL: process.env.TEST_URL || 'https://benefit-appeal.aat.platform.hmcts.net/',
    trace: 'on-first-retry',
    screenshot: { mode: 'only-on-failure', fullPage: true },
    headless: process.env.SHOW_BROWSER_WINDOW !== 'true',
    bypassCSP: true,
    ignoreHTTPSErrors: true
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  name: 'Submit Your Appeal Tests'
});

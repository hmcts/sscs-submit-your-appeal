// playwright.config.js
/* eslint-disable no-process-env */
/* eslint-disable no-sync */
const fs = require('fs');

const defaultChunks = files => {
  const hasFunctionalOrFullFunctionalAnnotation = file => {
    const content = fs.readFileSync(file, 'utf-8');
    return content.includes('@functional') || content.includes('@fullFunctional');
  };

  const filesWithKeyword = files.filter(file => hasFunctionalOrFullFunctionalAnnotation(file));
  return filesWithKeyword.map(file => [file]);
};

const testChunks = process.env.CHUNKS || defaultChunks;

module.exports = {
  testDir: './',
  outputDir: process.env.E2E_OUTPUT_DIR || './functional-output',
  expect: {
    timeout: 10 * 1000
  },
  timeout: 90000,
  workers: testChunks, // Parallel chunks
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
      use: {
        browserName: 'chromium',
        headless: process.env.SHOW_BROWSER_WINDOW !== 'true',
        viewport: { width: 1280, height: 960 },
        trace: 'on-first-retry',
        screenshot: { mode: 'only-on-failure', fullPage: true },
        baseURL: process.env.TEST_URL || 'https://benefit-appeal.aat.platform.hmcts.net/',
        bypassCSP: true,
        ignoreHTTPSErrors: true,
        actionTimeout: 10 * 1000
      }
    }
  ],
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
    baseURL: process.env.TEST_URL || 'https://benefit-appeal.aat.platform.hmcts.net/'
  },
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  name: 'Submit Your Appeal Tests'
};

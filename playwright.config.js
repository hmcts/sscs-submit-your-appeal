/* eslint-disable */
const {defineConfig, devices} = require('@playwright/test');
const config = require("config");
const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

module.exports = defineConfig({
  testDir: './test/e2e',
  url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
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
  features: {
    evidenceUpload: {
      enabled: evidenceUploadEnabled
    }
  },
  /* Opt out of parallel tests on CI. */
  workers: process.env.FUNCTIONAL_TESTS_WORKERS_COUNT ? 5 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: {mode: 'only-on-failure', fullPage: true},
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--ignore-certificate-errors'],
          logger: {
            isEnabled: (name, severity) => name === 'api',
            log: (name, severity, message, args) => console.log(`${name} ${severity} ${message}`)
          }
        }
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--ignore-certificate-errors']
        }
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          args: ['--ignore-certificate-errors']
        }
      },
    },
    {
      name: 'MobileChrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: {
          args: ['--ignore-certificate-errors']
        }
      },
    },
    {
      name: 'MobileSafari',
      use: {
        ...devices['iPhone 12'],
        launchOptions: {
          args: ['--ignore-certificate-errors']
        }
      },
    },
    {
      name: 'MicrosoftEdge',
      use: {
        ...devices['Desktop Edge'],
        launchOptions: {
          args: ['--ignore-certificate-errors']
        }, channel: 'msedge'
      },
    },
  ],
});

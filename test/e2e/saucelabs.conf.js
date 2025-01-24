// playwright.config.js
/* eslint-disable no-process-env */
const config = require('config');
const supportedBrowsers = require('./crossbrowser/supportedBrowsers.js');

const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const sauceUsername = process.env.SAUCE_USERNAME || config.get('saucelabs.username');
const sauceAccessKey = process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key');
const testUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');
const outputDir = config.get('saucelabs.outputDir');

// Generate Playwright projects from supported browsers
const generateProjects = browserGroup => {
  const projects = [];
  for (const browserName in supportedBrowsers[browserGroup]) {
    if (browserName) {
      const capabilities = supportedBrowsers[browserGroup][browserName];

      projects.push({
        name: `${browserGroup}-${browserName}`,
        use: {
          browserName: capabilities.browserName,
          headless: true,
          viewport: { width: 1280, height: 800 },
          ignoreHTTPSErrors: true,
          actionTimeout: smartWait,
          navigationTimeout: waitForTimeout,
          baseURL: testUrl,
          launchOptions: {
            args: capabilities['goog:chromeOptions'].args || [],
            // Sauce-specific options
            proxy: {
              server: 'http://ondemand.eu-central-1.saucelabs.com:80'
            },
            connectOptions: {
              username: sauceUsername,
              accessKey: sauceAccessKey,
              region: 'eu'
            }
          },
          contextOptions: {
            recordVideo: { dir: `${outputDir}/videos` }
          },
          trace: 'on',
          video: 'on'
        }
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return projects;
};

// Generate projects for all browser groups
const projects = [
  ...generateProjects('chromium'),
  ...generateProjects('firefox'),
  ...generateProjects('webkit')
];

module.exports = {
  testDir: './e2e-sya',
  outputDir,
  timeout: waitForTimeout,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: `${outputDir}/reports`,
        open: 'never'
      }
    ]
  ],
  globalSetup: require.resolve('./global-x-setup'),
  globalTeardown: require.resolve('./global-x-teardown'),
  projects,
  use: {
    baseURL: testUrl,
    actionTimeout: smartWait,
    navigationTimeout: waitForTimeout
  },
  name: 'Submit Your Appeal Crossbrowser Tests'
};

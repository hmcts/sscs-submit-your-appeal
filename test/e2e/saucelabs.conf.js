/* eslint-disable no-process-env */

const config = require('config');
const fileAcceptor = require('test/file_acceptor');
const supportedBrowsers = require('./crossbrowser/supportedBrowsers.js');
const logger = require('logger');

const logPath = 'saucelabs.conf.js';
const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');
const tunnelName = process.env.SAUCE_TUNNEL_IDENTIFIER || config.get('saucelabs.tunnelId');

const getBrowserConfig = browserGroup => {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
      desiredCapability.tunnelIdentifier = tunnelName;
      desiredCapability.tags = ['sscs'];
      browserConfig.push({
        browser: desiredCapability.browserName,
        desiredCapabilities: desiredCapability
      });
    } else {
      logger.exception('supportedBrowsers.js is empty or incorrectly defined', logPath);
    }
  }
  return browserConfig;
};

const pauseFor = seconds => {
  setTimeout(() => {
    return true;
  }, seconds * 1000);
};

const setupConfig = {
  tests: './e2e-sya/*.test.js',
  output: config.get('saucelabs.outputDir'),
  features: {
    evidenceUpload: {
      enabled: evidenceUploadEnabled
    }
  },
  helpers: {
    WebDriverIO: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      browser: process.env.SAUCE_BROWSER || config.get('saucelabs.browser'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      smartWait: parseInt(config.get('saucelabs.smartWait')),
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      user: process.env.SAUCE_USERNAME || config.get('saucelabs.username'),
      key: process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key'),
      desiredCapabilities: {}
    },
    MyHelper: {
      require: './helpers/helper.js',
      url: config.get('e2e.frontendUrl')
    },
    SauceLabsReportingHelper: { require: './helpers/SauceLabsReportingHelper.js' }
  },
  include: {
    I: './page-objects/steps.js'
  },
  bootstrapAll: done => {
    fileAcceptor.bootstrap(done);
  },
  teardownAll: done => {
    // Pause to allow SauceLabs to finish updating before Jenkins queries it for results
    logger.trace('Wait for 30 seconds before Jenkins queries SauceLabs results...'
      , logPath);
    pauseFor(30);
    fileAcceptor.teardown(done);
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      mochawesome: {
        stdout: './functional-output/console.log',
        options: {
          reportDir: config.get('saucelabs.outputDir'),
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    }
  },
  name: 'Submit Your Appeal Crossbrowser Tests'
};

exports.config = setupConfig;

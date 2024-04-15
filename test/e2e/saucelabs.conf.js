/* eslint-disable no-process-env */

const config = require('config');
const fileAcceptor = require('test/file_acceptor');
const supportedBrowsers = require('./crossbrowser/supportedBrowsers.js');
const logger = require('logger');

const logPath = 'saucelabs.conf.js';
const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');
const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.BROWSER_GROUP || 'chromium';

const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME || config.get('saucelabs.username'),
  accessKey: process.env.SAUCE_ACCESS_KEY || config.get('saucelabs.key'),
  acceptSslCerts: true,
  tags: ['SSCS']
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options']
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

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
    Playwright: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      browser,
      smartWait,
      waitForTimeout,
      waitForAction: 500,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {},
      waitForNavigation: 'networkidle',
      bypassCSP: true,
      ignoreHTTPSErrors: true
    },
    MyHelper: {
      require: './helpers/helper.js',
      url: config.get('e2e.frontendUrl')
    },
    Mochawesome: {
      uniqueScreenshotNames: 'true'
    }
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
      browsers: getBrowserConfig('chromium')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    },
    webkit: {
      browsers: getBrowserConfig('webkit')
    }
  },
  name: 'Submit Your Appeal Crossbrowser Tests'
};

exports.config = setupConfig;

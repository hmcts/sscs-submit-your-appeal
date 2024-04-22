/* eslint-disable no-process-env */
const config = require('config');
const fileAcceptor = require('test/file_acceptor');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

exports.config = {
  tests: './smoke/*.test.js',
  output: process.env.E2E_OUTPUT_DIR || config.get('e2e.smokeOutputDir'),
  features: {
    evidenceUpload: {
      enabled: evidenceUploadEnabled
    }
  },
  helpers: {
    Playwright: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      waitForNavigation: 'load',
      getPageTimeout: 60000,
      show: false,
      windowSize: '1000x1000',
      chrome: {
        ignoreHTTPSErrors: true,
        args: ['--headless=new', '--disable-gpu', '--no-sandbox', '--allow-running-insecure-content', '--ignore-certificate-errors']
      }
    },
    MyHelper: {
      require: './helpers/helper.js',
      url: config.get('e2e.frontendUrl')
    }
  },
  include: {
    I: './page-objects/steps.js'
  },
  bootstrapAll: done => {
    fileAcceptor.bootstrap(done);
  },
  teardownAll: done => {
    fileAcceptor.teardown(done);
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      mochawesome: {
        stdout: './smoke-output/console.log',
        options: {
          reportDir: './smoke-output',
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  name: 'Smoke test - Submit Your Appeal'
};

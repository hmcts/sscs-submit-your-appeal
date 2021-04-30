/* eslint-disable no-process-env */
const config = require('config');
const fileAcceptor = require('test/file_acceptor');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');


exports.config = {
  tests: './**/*.test.js',
  output: process.env.E2E_OUTPUT_DIR || config.get('e2e.outputDir'),
  features: {
    evidenceUpload: {
      enabled: evidenceUploadEnabled
    }
  },
  helpers: {
    Puppeteer: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      waitForNavigation: 'load',
      getPageTimeout: 60000,
      show: false,
      windowSize: '1440x1400',
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--allow-running-insecure-content',
          '--ignore-certificate-errors',
          '--window-size=1440,1400'
        ]
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
        stdout: './functional-output/console.log',
        options: {
          reportDir: process.env.E2E_OUTPUT_DIR || config.get('e2e.outputDir'),
          reportName: 'index',
          inlineAssets: true
        }
      }
    }
  },
  multiple: {
    parallel: {
      chunks: files => {
        let i = 0;
        let j = files.length;
        const chunk = Math.ceil(files.length / 8);
        const chunkedArray = new Array(Math.ceil(files.length / chunk));
        for (i = 0, j = files.length; i < j; i += chunk) {
          chunkedArray.push(files.slice(i, i + chunk));
        }
        return chunkedArray;
      },
      browsers: ['chrome']
    }
  },
  name: 'Submit Your Appeal Tests'
};
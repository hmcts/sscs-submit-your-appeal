/* eslint-disable no-process-env */
const config = require('config');
const fileAcceptor = require('test/file_acceptor');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

const getChunks = (chunks, amountOfTests, tests) => {
  const testChunks = [];
  for (let i = 0; i < chunks; i++) {
    const arr = [];
    arr.push(...tests.slice(i * amountOfTests, (i + 1) * amountOfTests));
    testChunks.push(arr);
  }
  return testChunks;
};

exports.config = {
  tests: './**/*.test.js',
  output: process.env.E2E_OUTPUT_DIR || config.get('e2e.outputDir'),
  timeout: 1000,
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
      waitForNavigation: 'networkidle0',
      show: true,
      windowSize: '1000x1000',
      chrome: {
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox']
      }
    },
    MyHelper: {
      require: './helper.js',
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
        options: { steps: true }
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
    pages: {
      chunks: files => {
        const pageTests = files.filter(file => !file.includes('journey'));
        return getChunks(5, 7, pageTests);
      },
      browsers: ['chrome']
    },
    functional: {
      chunks: files => {
        const journeyTests = files.filter(file => file.includes('journey'));
        return getChunks(3, 2, journeyTests);
      },
      browsers: ['chrome']
    }
  },
  name: 'Submit Your Appeal Tests'
};

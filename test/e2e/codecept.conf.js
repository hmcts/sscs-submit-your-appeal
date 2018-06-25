/* eslint-disable no-process-env */
const config = require('config');
const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

exports.config = {
  tests: './**/*.test.js',
  output: './output',
  timeout: 1000,
  features: {
    evidenceUpload: {
      enabled: evidenceUploadEnabled
    }
  },
  helpers: {
    Nightmare: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      show: true,
      windowSize: ' 1200x1200',
      switches: {
        'ignore-certificate-errors': true
      }
    }
  },
  include: {
    I: './page-objects/steps.js'
  },
  bootstrap: './../file_acceptor',
  teardown: './../file_acceptor',
  mocha: {
    reporterOptions: {
      reportDir: config.get('e2e.outputDir'),
      reportName: 'index',
      inlineAssets: true
    }
  },
  name: 'Submit Your Appeal Tests'
};

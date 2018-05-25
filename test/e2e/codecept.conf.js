const config = require('config');

exports.config = {
  tests: './**/*.test.js',
  output: './output',
  timeout: 1000,
  helpers: {
    Nightmare: {
      url: config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      show: false,
      windowSize: ' 1200x1200',
      switches: {
        'ignore-certificate-errors': true
      }
    }
  },
  include: {
    I: './page-objects/steps.js'
  },
  bootstrap: false,
  mocha: {
    reporterOptions: {
      reportDir: config.get('e2e.outputDir'),
      reportName: 'index',
      inlineAssets: true
    }
  },
  name: 'Submit Your Appeal Tests'
};

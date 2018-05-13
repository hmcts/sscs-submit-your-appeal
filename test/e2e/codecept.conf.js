const config = require('config');

exports.config = {
  tests: './**/*.test.js',
  output: './output',
  timeout: 1000,
  helpers: {
    puppeteer: {
      url: config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      show: false,
      windowSize: '1000x1000',
      ignoreHTTPSErrors: true
    },
    MyHelper: {
      require: './helper.js',
      url: config.get('e2e.frontendUrl')
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

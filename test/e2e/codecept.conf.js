/* eslint-disable no-process-env */
const config = require('config');

exports.config = {
  tests: './**/*.test.js',
  output: process.env.E2E_OUTPUT_DIR || config.get('e2e.outputDir'),
  timeout: 1000,
  helpers: {
    Puppeteer: {
      url: process.env.TEST_URL || config.get('e2e.frontendUrl'),
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      show: false,
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
  bootstrap: false,
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
    parallel: {
      chunks: files => {
        const journeyTests = files.filter(file => file.includes('journey'));
        const otherTests = files.filter(file => !file.includes('journey'));

        const testChunks = [];
        for (let i = 0; i < journeyTests.length; i++) {
          const arr = [];
          arr.push(...otherTests.slice(i * 7, (i + 1) * 7));
          arr.push(journeyTests[i]);
          testChunks.push(arr);
        }

        return testChunks;
      },
      browsers: ['chrome']
    }
  },
  name: 'Submit Your Appeal Tests'
};

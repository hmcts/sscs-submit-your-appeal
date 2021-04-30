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
        function shuffle(array) {
          // randomise array
          let currentIndex = array.length;
          let randomIndex = 0;
          let temporaryValue = array[0];
          while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }
          return array;
        }
        function splitFiles(list, size) {
          const sets = [];
          const chunks = list.length / size;
          let i = 0;
          while (i < chunks) {
            sets[i] = list.splice(0, size);
            i = i + 1;
          }
          return sets;
        }
        const shuffledArray = shuffle(files);
        return splitFiles(shuffledArray, Math.ceil(shuffledArray.length / 8));
      },
      browsers: ['chrome']
    }
  },
  name: 'Submit Your Appeal Tests'
};
/* eslint-disable no-process-env */
const config = require('config');
const fileAcceptor = require('test/file_acceptor');
const fs = require('fs');
const testUser = require('../util/IdamUser');
const urls = require('../../urls');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

const defaultChunks = files => {
  function hasFunctionalOrFullFunctionalAnnotation(file) {
    // eslint-disable-next-line id-blacklist,no-sync
    const cont = fs.readFileSync(file, 'utf-8');
    return cont.indexOf('@functional') > -1 || cont.indexOf('@fullFunctional') > -1;
  }
  const filesWithKeyword = files.filter(file => hasFunctionalOrFullFunctionalAnnotation(file));

  return filesWithKeyword.map(file => [file]);
};

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
      url: `${urls.formDownload.benefitAppeal}`,
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      waitForNavigation: 'load',
      getPageTimeout: 10000,
      show: false,
      windowSize: '1000x1000',
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--headless=new',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--allow-running-insecure-content',
          '--ignore-certificate-errors'
        ]
      }
    },
    MyHelper: {
      require: './helpers/helper.js',
      url: `${urls.formDownload.benefitAppeal}`
    },
    REST: {
    }
  },
  include: {
    I: './page-objects/steps.js'
  },
  bootstrapAll: done => {
    fileAcceptor.bootstrap(done);
    process.env.USEREMAIL_1 = testUser.createUser();
  },
  teardownAll: done => {
    fileAcceptor.teardown(done);
    testUser.deleteUser(process.env.USEREMAIL_1);
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
      chunks: process.env.CHUNKS || defaultChunks,
      browsers: ['chrome']
    }
  },
  name: 'Submit Your Appeal Tests'
};

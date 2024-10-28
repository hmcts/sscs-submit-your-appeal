/* eslint-disable no-process-env */
// const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');
// const MyHelper = require('../helpers/helper');
const IBASteps = require('./e2e-iba-steps');


const language = 'en';

// const content = require('commonContent');

Feature(`${language.toUpperCase()} - IBA E2E SYA - Full Journey`);

// eslint-disable-next-line require-await
Scenario(`${language.toUpperCase()} - IBA E2E SYA Journey`, async({ I }) => {
  // const commonContent = content[language];
  const url = process.env.TEST_URL;
  I.createTheSession(language, url);
  I.wait(1);
  IBASteps.WhatLanguageDoYouWantToChoosePageContent();
}).tag('@wip').retry(10);

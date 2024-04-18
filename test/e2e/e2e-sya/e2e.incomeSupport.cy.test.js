/* eslint-disable no-process-env */

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');
// const config = require('config');

// const testConfig = config.get('e2e.retry');

const benefitCode = testDataEn.benefitTypes[11].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[11].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[11].office;

Feature(`${language.toUpperCase()} - Income Support E2E SYA - Full Journey`);
Scenario(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, ({ I }) => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, signer, language, hasDwpIssuingOffice);
}).retry(10);

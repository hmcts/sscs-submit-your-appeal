/* eslint-disable no-process-env */

const language = 'en';

const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[2].code;
const office = testDataEn.benefitTypes[2].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[2].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - UC E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - ${benefitCode} UC E2E SYA Journey @functional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
}).retry(10);
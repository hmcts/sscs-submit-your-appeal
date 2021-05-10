/* eslint-disable no-process-env */

const language = 'cy';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[3].code;
const office = testDataEn.benefitTypes[3].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[3].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - DLA E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - DLA E2E SYA Journey @fullfunctional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
}).retry(5);
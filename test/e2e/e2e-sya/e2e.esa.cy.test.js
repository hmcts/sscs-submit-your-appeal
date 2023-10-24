/* eslint-disable no-process-env */

const language = 'cy';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[1].code;
const office = testDataEn.benefitTypes[1].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[1].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - ESA E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - ESA E2E SYA Journey @fullFunctional @e2e`, ({ I }) => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
}).retry(8);

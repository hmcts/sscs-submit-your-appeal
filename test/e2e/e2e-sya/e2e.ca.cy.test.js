/* eslint-disable no-process-env */

const language = 'cy';

const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[4].codeWelsh;
const office = testDataEn.benefitTypes[4].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[4].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - Carer's Allowance E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - Carer's Allowance ${benefitCode} E2E SYA Journey @functional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
}).retry(20);

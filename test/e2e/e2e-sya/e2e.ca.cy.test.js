/* eslint-disable no-process-env */

const language = 'cy';

const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[4].codeWelsh;
const benefitSearchName = testDataEn.benefitTypes[4].searchNameWelsh;
const office = testDataEn.benefitTypes[4].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[4].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - Carer's Allowance E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - Carer's Allowance ${benefitCode} E2E SYA Journey @fullfunctional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitSearchName, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
}).retry(1);

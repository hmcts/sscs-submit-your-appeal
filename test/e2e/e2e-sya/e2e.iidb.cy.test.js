/* eslint-disable no-process-env */

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[7].codeWelsh;
const benefitSearch = testDataEn.benefitTypes[7].codeSearchWelsh; // Needed so that the correct benefit type is found when searching.
const hasDwpIssuingOffice = testDataEn.benefitTypes[7].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[7].office;

Feature(`${language.toUpperCase()} - Industrial Injuries Disablement Benefit E2E SYA - Full Journey`);
Scenario(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e @now`, I => {
  e2eBenefit.e2eBenefit(I, benefitSearch, office, signer, language, hasDwpIssuingOffice);
}).retry(5);

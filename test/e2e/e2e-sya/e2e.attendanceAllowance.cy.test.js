/* eslint-disable no-process-env */

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[5].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[5].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[5].office;

Feature(`${language.toUpperCase()} - Attendance Allowance E2E SYA - Full Journey`);
Scenario(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullfunctional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, signer, language, hasDwpIssuingOffice);
}).retry(1);

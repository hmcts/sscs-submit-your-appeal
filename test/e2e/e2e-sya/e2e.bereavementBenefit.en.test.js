/* eslint-disable no-process-env */

const language = 'en';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[6].code;
const office = testDataEn.benefitTypes[6].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[6].hasDwpIssuingOffice;

Feature(`${language.toUpperCase()} - Bereavement Benefit E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullfunctional @e2e`, I => {
  e2eBenefit.e2eBenefit(I, benefitCode, office, signer, language, hasDwpIssuingOffice);
}).retry(1);

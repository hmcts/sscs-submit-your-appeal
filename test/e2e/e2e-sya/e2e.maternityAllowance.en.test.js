/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'en';
const signer = require(`../data.${language}`).signAndSubmit.signer;
const testDataEn = require('../data.en');
const e2eBenefit = require('../e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[8].code;
const office = testDataEn.benefitTypes[8].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[8].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - Maternity Allowance E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, signer, language, hasDwpIssuingOffice);
  });
});

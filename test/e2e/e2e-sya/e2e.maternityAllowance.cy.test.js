/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'cy';
const signer = require(`../data.${language}`).signAndSubmit.signer;
const testDataEn = require('../data.en');
const e2eBenefit = require('../e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[8].codeWelsh;
const benefitSearch = testDataEn.benefitTypes[8].codeSearchWelsh; // Needed so that the correct benefit type is found when searching.
const hasDwpIssuingOffice = testDataEn.benefitTypes[8].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[8].office;

test.describe(`${language.toUpperCase()} - Maternity Allowance E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitSearch, office, signer, language, hasDwpIssuingOffice);
  });
});

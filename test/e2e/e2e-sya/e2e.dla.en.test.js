/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'en';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[3].code;
const office = testDataEn.benefitTypes[3].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[3].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - DLA E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - DLA E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
  });
});

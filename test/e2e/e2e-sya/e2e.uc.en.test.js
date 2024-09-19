/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'en';

const testData = require(`../data.${language}`);
const testDataEn = require('../data.en');
const e2eBenefit = require('../e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[2].code;
const office = testDataEn.benefitTypes[2].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[2].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - UC E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} UC E2E SYA Journey @functional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
  });
});

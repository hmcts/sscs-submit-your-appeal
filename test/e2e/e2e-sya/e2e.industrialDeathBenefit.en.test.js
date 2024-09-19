/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'en';
const signer = require(`../data.${language}`).signAndSubmit.signer;
const testDataEn = require('../data.en');
const e2eBenefit = require('../e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[13].code;
const office = testDataEn.benefitTypes[13].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[13].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - Industrial Death Benefit E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullfunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, signer, language, hasDwpIssuingOffice);
  });
});

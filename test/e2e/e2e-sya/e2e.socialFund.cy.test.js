/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'cy';
const signer = require(`../data.${language}`).signAndSubmit.signer;
const testDataEn = require('../data.en');
const e2eBenefit = require('../e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[10].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[10].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[10].office;

test.describe(`${language.toUpperCase()} - Social Fund E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullFunctional @e2e`, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, signer, language, hasDwpIssuingOffice);
  });
});

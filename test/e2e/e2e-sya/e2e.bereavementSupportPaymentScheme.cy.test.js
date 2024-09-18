/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[12].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[12].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[12].office;

test.describe(`${language.toUpperCase()} - Bereavement Support Payment Scheme E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} E2E SYA Journey @fullfunctional @e2e`, async({
    page
  }) => {
    await e2eBenefit.e2eBenefit(
      page,
      benefitCode,
      office,
      signer,
      language,
      hasDwpIssuingOffice
    );
  });
});

// test/e2e/e2e-sya/e2e.industrialDeathBenefit.en.test.js
const { test } = require('@playwright/test');

const language = 'en';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[13].code;
const office = testDataEn.benefitTypes[13].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[13].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - Industrial Death Benefit E2E SYA - Full Journey`, () => {
  test(
    `${language.toUpperCase()} - ${benefitCode} E2E SYA Journey`,
    { tag: ['@fullFunctional', '@e2e'] },
    async({ page }) => {
      await e2eBenefit.e2eBenefit(
        page,
        benefitCode,
        office,
        testData.signAndSubmit.signer,
        language,
        hasDwpIssuingOffice
      );
    }
  );
});

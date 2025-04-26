// test/e2e/e2e-sya/e2e.pensionCredits.cy.test.js
const { test } = require('@playwright/test');

const language = 'cy';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[14].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[14].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[14].office;

test.describe(`${language.toUpperCase()} - Pension Credit E2E SYA - Full Journey`, () => {
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

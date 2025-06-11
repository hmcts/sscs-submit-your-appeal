// test/e2e/e2e-sya/e2e.ca.cy.test.js
const { test } = require('@playwright/test');

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[4].codeWelsh;
const benefitSearchName = testDataEn.benefitTypes[4].searchNameWelsh;
const office = testDataEn.benefitTypes[4].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[4].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - Carer's Allowance E2E SYA - Full Journey`, () => {
  test(
    `${language.toUpperCase()} - Carer's Allowance ${benefitCode} E2E SYA Journey`,
    { tag: ['@fullFunctional', '@e2e'] },
    async ({ page }) => {
      await e2eBenefit.e2eBenefit(
        page,
        benefitSearchName,
        office,
        signer,
        language,
        hasDwpIssuingOffice
      );
    }
  );
});

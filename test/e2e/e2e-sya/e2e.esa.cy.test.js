// test/e2e/e2e-sya/e2e.esa.cy.test.js
const { test } = require('@playwright/test');

const language = 'cy';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[1].code;
const office = testDataEn.benefitTypes[1].office;
const hasDwpIssuingOffice = testDataEn.benefitTypes[1].hasDwpIssuingOffice;

test.describe(`${language.toUpperCase()} - ESA E2E SYA - Full Journey`, () => {
  test(
    `${language.toUpperCase()} - ESA E2E SYA Journey`,
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

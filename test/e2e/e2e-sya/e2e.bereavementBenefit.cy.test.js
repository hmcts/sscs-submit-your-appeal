// test/e2e/e2e-sya/e2e.bereavementBenefit.cy.test.js
const { test } = require('@playwright/test');

const language = 'cy';
const signer = require(`test/e2e/data.${language}`).signAndSubmit.signer;
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[6].codeWelsh;
const hasDwpIssuingOffice = testDataEn.benefitTypes[6].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[6].office;

test.describe(`${language.toUpperCase()} - Bereavement Benefit E2E SYA - Full Journey`, () => {
  test(
    `${language.toUpperCase()} - ${benefitCode} E2E SYA Journey`,
    { tag: ['@fullFunctional', '@e2e'] },
    async({ page }) => {
      await e2eBenefit.e2eBenefit(
        page,
        benefitCode,
        office,
        signer,
        language,
        hasDwpIssuingOffice
      );
    }
  );
});

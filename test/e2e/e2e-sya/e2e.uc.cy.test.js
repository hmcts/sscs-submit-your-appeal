// test/e2e/e2e-sya/e2e.uc.cy.test.js
const { test } = require('@playwright/test');

const language = 'cy';
const testData = require(`test/e2e/data.${language}`);
const testDataEn = require('test/e2e/data.en');
const e2eBenefit = require('test/e2e/e2e-sya/e2e-benefit');

const benefitCode = testDataEn.benefitTypes[2].code;
const hasDwpIssuingOffice = testDataEn.benefitTypes[2].hasDwpIssuingOffice;
const office = testDataEn.benefitTypes[2].office;

test.describe(`${language.toUpperCase()} - UC E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - ${benefitCode} UC E2E SYA Journey`, { tag: ['@functional', '@e2e'] }, async({ page }) => {
    await e2eBenefit.e2eBenefit(page, benefitCode, office, testData.signAndSubmit.signer, language, hasDwpIssuingOffice);
  });
});
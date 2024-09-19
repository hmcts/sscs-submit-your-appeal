const language = 'cy';
const commonContent = require('commonContent')[language];
const dwpIssuingOfficeContent = require(`steps/compliance/dwp-issuing-office/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterDWPIssuingOfficeAndContinue, seeDWPIssuingOfficeError } = require('../../page-objects/compliance/dwpIssuingOffice');

test.describe(`${language.toUpperCase()} - DWP Issuing Office @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.dwpIssuingOffice);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter a valid issuing office, I am taken to the mrn date page`, async({ page }) => {
    await enterDWPIssuingOfficeAndContinue(page, commonContent, '1');
    await page.waitForURL(`**/${paths.compliance.mrnDate}`);
  });

  test(`${language.toUpperCase()} - When I click continue without adding a dwp issuing office I see an error`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await seeDWPIssuingOfficeError(page, paths.compliance.dwpIssuingOffice, dwpIssuingOfficeContent.fields.pipNumber.error.required);
  });
});

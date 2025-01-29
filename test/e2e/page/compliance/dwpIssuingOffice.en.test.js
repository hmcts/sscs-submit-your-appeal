const language = 'en';
const commonContent = require('commonContent')[language];
const dwpIssuingOfficeContent = require(`steps/compliance/dwp-issuing-office/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterDWPIssuingOfficeAndContinue } = require('../../page-objects/compliance/dwpIssuingOffice');

test.describe(`${language.toUpperCase()} - DWP Issuing Office`, { tag: '@batch-07' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.dwpIssuingOffice);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page enter a valid issuing office, page am taken to the mrn date page`, async({ page }) => {
    await enterDWPIssuingOfficeAndContinue(page, commonContent, '1');
    await page.waitForURL(`**${paths.compliance.mrnDate}`);
  });

  test(`${language.toUpperCase()} - When page click continue without adding a dwp issuing office page see an error`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    page.seeDWPIssuingOfficeError(paths.compliance.dwpIssuingOffice, dwpIssuingOfficeContent.fields.pipNumber.error.required);
  });
});

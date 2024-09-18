const language = 'en';
const commonContent = require('commonContent')[language];
const dwpIssuingOfficeContent = require(`steps/compliance/dwp-issuing-office/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - DWP Issuing Office @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.dwpIssuingOffice);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter a valid issuing office, I am taken to the mrn date page`, ({ page }) => {
    enterDWPIssuingOfficeAndContinue(page, commonContent, '1');
    page.seeInCurrentUrl(paths.compliance.mrnDate);
  });

  test(`${language.toUpperCase()} - When I click continue without adding a dwp issuing office I see an error`, ({
    page,
  }) => {
    await page.click(commonContent.continue);
    page.seeDWPIssuingOfficeError(
      paths.compliance.dwpIssuingOffice,
      dwpIssuingOfficeContent.fields.pipNumber.error.required,
    );
  });
});

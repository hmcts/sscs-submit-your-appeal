const language = 'cy';
const cantAppealContent = require(
  `steps/compliance/cant-appeal/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Cannot appeal @batch-07`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.cantAppeal);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I exit the service after being told I cannot appeal`, async({
    page
  }) => {
    await page.click(cantAppealContent.govuk);
    await page.goto('https://www.gov.uk');
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(
      page.locator('form input[name="_csrf"]').first()
    ).toBeVisible();
  });
});

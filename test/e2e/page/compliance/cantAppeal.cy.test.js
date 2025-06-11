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

test.describe(
  `${language.toUpperCase()} - Cannot appeal`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.cantAppeal);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - page exit the service after being told page cannot appeal`, async ({
      page
    }) => {
      await page.getByText(cantAppealContent.govuk).first().click();
      await page.goto('https://www.gov.uk');
    });

    test(`${language.toUpperCase()} - page have a csrf token`, async ({
      page
    }) => {
      await expect(
        page.locator('form input[name="_csrf"]').first()
      ).toBeVisible();
    });
  }
);

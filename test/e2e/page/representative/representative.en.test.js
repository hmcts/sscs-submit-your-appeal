const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(
  `${language.toUpperCase()} - Representative`,
  { tag: '@batch-10' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.representative.representative);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page select yes, page am taken to the representative details page`, async ({
      page
    }) => {
      page.selectDoYouHaveARepresentativeAndContinue(
        commonContent,
        '#hasRepresentative'
      );
      await page.waitForURL(`**${paths.representative.representativeDetails}`);
    });

    test(`${language.toUpperCase()} - When page select No, page am taken to the reason for appealing page`, async ({
      page
    }) => {
      page.selectDoYouHaveARepresentativeAndContinue(
        commonContent,
        '#hasRepresentative-2'
      );
      await page.waitForURL(
        `**${paths.reasonsForAppealing.reasonForAppealing}`
      );
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

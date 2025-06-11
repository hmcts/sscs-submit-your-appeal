const language = 'en';
const commonContent = require('commonContent')[language];
const confirmationContent = require(`steps/confirmation/content.${language}`);
const paths = require('paths');
const urls = require('urls');

const { test, expect } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(
  `${language.toUpperCase()} - Confirmation`,
  { tag: '@batch-08' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.confirmation);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page go to the page page see the header`, async ({
      page
    }) => {
      await expect(
        page.getByText(confirmationContent.title).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click the Continue button page am taken to the smart survey page`, async ({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${urls.surveyLink}`);
    });
  }
);

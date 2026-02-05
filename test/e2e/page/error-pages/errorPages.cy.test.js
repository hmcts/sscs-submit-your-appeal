const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(
  `${language.toUpperCase()} - Error Pages`,
  { tag: '@batch-08' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page go to a path that /does-not-exist page see an error message`, async ({
      page
    }) => {
      await page.goto(paths.errors.doesNotExist);
      await expect(
        page.getByText(commonContent.errors.notFound.title).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page go to /internal-server-error page see an error message`, async ({
      page
    }) => {
      await page.goto(paths.errors.internalServerError);
      await expect(
        page.getByText(commonContent.errors.serverError.title).first()
      ).toBeVisible();
    });
  }
);

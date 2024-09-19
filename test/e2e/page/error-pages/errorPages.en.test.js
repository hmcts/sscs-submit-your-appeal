const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Error Pages @batch-08`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to a path that /does-not-exist I see an error message`, async({ page }) => {
    await page.goto(paths.errors.doesNotExist);
    await expect(page.getByText(commonContent.errors.notFound.title).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I go to /internal-server-error I see an error message`, async({ page }) => {
    await page.goto(paths.errors.internalServerError);
    await expect(page.getByText(commonContent.errors.serverError.title).first()).toBeVisible();
  });
});

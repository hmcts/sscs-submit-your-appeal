const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Error Pages @batch-08`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to a path that /does-not-exist I see an error message`, ({ page }) => {
    page.goto(paths.errors.doesNotExist);
    expect(page.getByText(commonContent.errors.notFound.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I go to /internal-server-error I see an error message`, ({ page }) => {
    page.goto(paths.errors.internalServerError);
    expect(page.getByText(commonContent.errors.serverError.title)).toBeVisible();
  });
});

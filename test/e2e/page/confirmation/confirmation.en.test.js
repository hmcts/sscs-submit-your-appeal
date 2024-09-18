const language = 'en';
const commonContent = require('commonContent')[language];
const confirmationContent = require(`steps/confirmation/content.${language}`);
const paths = require('paths');
const urls = require('urls');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Confirmation @batch-08`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.confirmation);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to the page I see the header`, ({ page }) => {
    expect(page.getByText(confirmationContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click the Continue button I am taken to the smart survey page`, ({ page }) => {
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(urls.surveyLink);
  });
});

const language = 'cy';
const commonContent = require('commonContent')[language];
const confirmationContent = require(`steps/confirmation/content.${language}`);
const paths = require('paths');
const urls = require('urls');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Confirmation @batch-08`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.confirmation);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to the page I see the header`, async({
    page
  }) => {
    await expect(page.getByText(confirmationContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click the Continue button I am taken to the smart survey page`, async({
    page
  }) => {
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${urls.surveyLink}`);
  });
});

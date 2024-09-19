const language = 'en';
const commonContent = require('commonContent')[language];
const appellantNameContent = require(`steps/identity/appellant-name/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Appellant Name form @batch-09`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantName);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I fill in the fields and click Continue, I am taken to /enter-appellant-dob`, async({ page }) => {
    await page.fill('title', 'Mr');
    await page.fill('firstName', 'Harry');
    await page.fill('lastName', 'Potter');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.identity.enterAppellantDOB}`);
  });

  test(`${language.toUpperCase()} - When I only provide a single character for firstName and lastName I see errors`, async({ page }) => {
    await page.fill('#firstName', 'H');
    await page.fill('#lastName', 'P');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(appellantNameContent.fields.firstName.error.invalid).first()).toBeVisible();
    await expect(page.getByText(appellantNameContent.fields.lastName.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue without filling in the fields I see errors`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(appellantNameContent.fields.title.error.required).first()).toBeVisible();
    await expect(page.getByText(appellantNameContent.fields.firstName.error.required).first()).toBeVisible();
    await expect(page.getByText(appellantNameContent.fields.lastName.error.required).first()).toBeVisible();
  });
});

const language = 'cy';
const commonContent = require('commonContent')[language];
const postcodeCheckerContent = require(`steps/start/postcode-checker/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Enter postcode`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.start.postcodeCheck);
  });
  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });
  test(`${language.toUpperCase()} - When I go to the enter postcode page I see the page heading`, async({ page }) => {
    await expect(page.getByText(postcodeCheckerContent.title).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When entering a postcode in England, I go to the /are-you-an-appointee page`, async({ page }) => {
    await page.fill('#postcode', 'WV11 2HE');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.identity.areYouAnAppointee}`);
  });

  test(`${language.toUpperCase()} - When I enter a postcode in Scotland, I go to the /invalid postcode page`, async({ page }) => {
    await page.fill('#postcode', 'EH8 8DX');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.start.invalidPostcode}`);
  });

  test(`${language.toUpperCase()} - When I enter an invalid postcode I see an error`, async({ page }) => {
    await page.fill('#postcode', 'INVALID POSTCODE');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.start.postcodeCheck}`);
    await expect(page.getByText(postcodeCheckerContent.fields.postcode.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I leave the postcode field empty and continue, I see an error`, async({ page }) => {
    await page.fill('#postcode', '');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**/${paths.start.postcodeCheck}`);
    await expect(page.getByText(postcodeCheckerContent.fields.postcode.error.emptyField).first()).toBeVisible();
  });
});

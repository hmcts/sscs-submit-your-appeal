const language = 'cy';
const commonContent = require('commonContent')[language];
const postcodeCheckerContent = require(
  `steps/start/postcode-checker/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Enter postcode`, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.start.postcodeCheck);
  });

  test(`${language.toUpperCase()} - When page go to the enter postcode page page see the page heading`, async({
    page
  }) => {
    await expect(
      page.getByText(postcodeCheckerContent.title).first()
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - When entering a postcode in England, page go to the /are-you-an-appointee page`, async({
    page
  }) => {
    await page.locator('#postcode').fill('WV11 2HE');
    await page
      .getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await page.waitForURL(`**${paths.identity.areYouAnAppointee}`);
  });

  test(`${language.toUpperCase()} - When page enter a postcode in Scotland, page go to the /invalid postcode page`, async({
    page
  }) => {
    await page.locator('#postcode').fill('EH8 8DX');
    await page
      .getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await page.waitForURL(`**${paths.start.invalidPostcode}`);
  });

  test(`${language.toUpperCase()} - When page enter an invalid postcode page see an error`, async({
    page
  }) => {
    await page.locator('#postcode').fill('INVALID POSTCODE');
    await page
      .getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await page.waitForURL(`**${paths.start.postcodeCheck}`);
    await expect(
      page
        .getByText(postcodeCheckerContent.fields.postcode.error.invalid)
        .first()
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page leave the postcode field empty and continue, page see an error`, async({
    page
  }) => {
    await page.locator('#postcode').fill('');
    await page
      .getByRole('button', { name: commonContent.continue })
      .first()
      .click();
    await page.waitForURL(`**${paths.start.postcodeCheck}`);
    await expect(
      page
        .getByText(postcodeCheckerContent.fields.postcode.error.emptyField)
        .first()
    ).toBeVisible();
  });
});

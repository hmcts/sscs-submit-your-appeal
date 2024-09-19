const language = 'en';
const independenceContent = require(`../../../../steps/start/independence/content.${language}`);
const appealFormDownloadContent = require(`../../../../steps/appeal-form-download/content.${language}`);
const appointeeContent = require(`../../../../steps/identity/appointee/content.${language}`);
const paths = require('../../../../paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { selectAreYouAnAppointeeAndContinue } = require('../../page-objects/identity/appointee');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Appointee form @batch-09`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.identity.areYouAnAppointee);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select Yes, I am taken to the download appointee form page`, async({ page }) => {
    await selectAreYouAnAppointeeAndContinue(page, language, appointeeContent.fields.isAppointee.yes);
    await page.waitForURL(`**/${paths.appealFormDownload}`);
    await expect(page.getByText(appealFormDownloadContent.title).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the independence page`, async({ page }) => {
    await selectAreYouAnAppointeeAndContinue(page, language, appointeeContent.fields.isAppointee.no);
    await page.waitForURL(`**/${paths.start.independence}`);
    await expect(page.getByText(independenceContent.title).first()).toBeVisible();
  });
});

const language = 'en';
const independenceContent = require(`steps/start/independence/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const appointeeContent = require(`steps/identity/appointee/content.${language}`);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Appointee form`, { tag: '@batch-09' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.areYouAnAppointee);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page select Yes, page am taken to the download appointee form page`, async({ page }) => {
    page.selectAreYouAnAppointeeAndContinue(language, appointeeContent.fields.isAppointee.yes);
    await page.waitForURL(`**${paths.appealFormDownload}`);
    await expect(page.getByText(appealFormDownloadContent.title).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page select No, page am taken to the independence page`, async({ page }) => {
    page.selectAreYouAnAppointeeAndContinue(language, appointeeContent.fields.isAppointee.no);
    await page.waitForURL(`**${paths.start.independence}`);
    await expect(page.getByText(independenceContent.title).first()).toBeVisible();
  });
});

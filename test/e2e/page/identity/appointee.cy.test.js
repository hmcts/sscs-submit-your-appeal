const language = 'cy';
const independenceContent = require(
  `steps/start/independence/content.${language}`
);
const appealFormDownloadContent = require(
  `steps/appeal-form-download/content.${language}`
);
const appointeeContent = require(
  `steps/identity/appointee/content.${language}`
);
const paths = require('paths');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  selectAreYouAnAppointeeAndContinue
} = require('../../page-objects/identity/appointee');

test.describe(`${language.toUpperCase()} - Appointee form @batch-09`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.areYouAnAppointee);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select Yes, I am taken to the download appointee form page`, async({
    page
  }) => {
    await selectAreYouAnAppointeeAndContinue(
      page,
      language,
      appointeeContent.fields.isAppointee.yes
    );
    await page.waitForURL(`**/${paths.appealFormDownload}`);
    await expect(page.getByText(appealFormDownloadContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the independence page`, async({
    page
  }) => {
    await selectAreYouAnAppointeeAndContinue(
      page,
      language,
      appointeeContent.fields.isAppointee.no
    );
    await page.waitForURL(`**/${paths.start.independence}`);
    await expect(page.getByText(independenceContent.title)).toBeVisible();
  });
});

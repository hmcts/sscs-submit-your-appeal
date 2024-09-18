const language = 'en';
const independenceContent = require(`steps/start/independence/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const appointeeContent = require(`steps/identity/appointee/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Appointee form @batch-09`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.identity.areYouAnAppointee);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select Yes, I am taken to the download appointee form page`, ({ page }) => {
    selectAreYouAnAppointeeAndContinue(page, language, appointeeContent.fields.isAppointee.yes);
    page.seeInCurrentUrl(paths.appealFormDownload);
    expect(page.getByText(appealFormDownloadContent.title)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the independence page`, ({ page }) => {
    selectAreYouAnAppointeeAndContinue(page, language, appointeeContent.fields.isAppointee.no);
    page.seeInCurrentUrl(paths.start.independence);
    expect(page.getByText(independenceContent.title)).toBeVisible();
  });
});

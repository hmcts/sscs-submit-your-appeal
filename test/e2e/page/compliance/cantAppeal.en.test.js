const language = 'en';
const cantAppealContent = require(`steps/compliance/cant-appeal/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Cannot appeal @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.cantAppeal);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I exit the service after being told I cannot appeal`, ({ page }) => {
    await page.click(cantAppealContent.govuk);
    page.goto('https://www.gov.uk');
  });

  test(`${language.toUpperCase()} - I have a csrf token`, ({ page }) => {
    page.seeElementInDOM('form input[name="_csrf"]');
  });
});

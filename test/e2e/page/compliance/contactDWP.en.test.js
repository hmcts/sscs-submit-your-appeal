const language = 'en';
const contactDwpContent = require(`steps/compliance/contact-dwp/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Contact DWP @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.contactDWP);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I exit the service after being told I need to contact DWP`, ({ page }) => {
    await page.click(contactDwpContent.govuk);
    page.goto('https://www.gov.uk');
  });
});

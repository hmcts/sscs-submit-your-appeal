const language = 'cy';
const contactDwpContent = require(`steps/compliance/contact-dwp/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Contact DWP @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.contactDWP);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I exit the service after being told I need to contact DWP`, async({ page }) => {
    await page.getByText(contactDwpContent.govuk).first().click();
    await page.goto('https://www.gov.uk');
  });
});

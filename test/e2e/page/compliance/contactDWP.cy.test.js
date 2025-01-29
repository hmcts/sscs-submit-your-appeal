const language = 'cy';
const contactDwpContent = require(`steps/compliance/contact-dwp/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Contact DWP`, { tag: '@batch-07' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.contactDWP);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - page exit the service after being told page need to contact DWP`, async({ page }) => {
    await page.getByText(contactDwpContent.govuk).first().click();
    await page.goto('https://www.gov.uk');
  });
});

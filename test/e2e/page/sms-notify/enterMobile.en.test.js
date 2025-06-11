const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  createTheSession
} = require('../../page-objects/session/createSession');

test.describe(
  `${language.toUpperCase()} - Enter Mobile`,
  { tag: '@batch-11' },
  () => {
    test.beforeEach('Create session', async({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.smsNotify.enterMobile);
    });

    test.afterEach('End session', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page enter a valid mobile number, page am taken to the sms-confirmation page`, async({
      page
    }) => {
      await page.locator('#enterMobile').fill('07223344556');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await page.waitForURL(`**${paths.smsNotify.smsConfirmation}`);
    });
  }
);

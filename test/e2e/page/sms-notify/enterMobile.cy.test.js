const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Enter Mobile @batch-11`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.smsNotify.enterMobile);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter a valid mobile number, I am taken to the sms-confirmation page`, async({
    page
  }) => {
    await page.fill('#enterMobile', '07223344556');
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.smsNotify.smsConfirmation}`);
  });
});

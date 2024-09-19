/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const paths = require('../../../../paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Enter Mobile @batch-11`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.smsNotify.enterMobile);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter a valid mobile number, I am taken to the sms-confirmation page`, async({ page }) => {
    await page.fill('#enterMobile', '07223344556');
    await page.getByText(commonContent.continue).first().click();
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
  });
});

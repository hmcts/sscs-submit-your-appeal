/* eslint-disable no-useless-escape */
const language = 'en';
const commonContent = require('../../../../commonContent')[language];
const textRemindersContent = require(`../../../../steps/sms-notify/text-reminders/content.${language}`);
const paths = require('../../../../paths');

const { test } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterAppellantContactDetailsWithMobileAndContinue } = require('../../page-objects/identity/appellantDetails');
const { selectUseSameNumberAndContinue } = require('../../page-objects/sms-notify/smsNotify');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - Send to number @batch-11`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.identity.enterAppellantContactDetails);
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    await page.waitForURL(`**\/${paths.smsNotify.appellantTextReminders}`);
    await page.getByText(textRemindersContent.fields.doYouWantTextMsgReminders.yes).first().click();
    await page.getByText(commonContent.continue).first().click();
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select Yes, I am taken to the sms confirmation page`, async({ page }) => {
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    await page.waitForURL(`**\/${paths.smsNotify.smsConfirmation}`);
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the enter mobile page`, async({ page }) => {
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-no');
    await page.waitForURL(`**\/${paths.smsNotify.enterMobile}`);
  });
});

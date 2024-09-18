const language = 'cy';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(
  `steps/sms-notify/text-reminders/content.${language}`
);
const paths = require('paths');

const { test } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  enterAppellantContactDetailsWithMobileAndContinue,
  enterAppellantContactDetailsAndContinue
} = require('../../page-objects/identity/appellantDetails');

test.describe(`${language.toUpperCase()} - Text Reminders - appellant contact details @batch-11`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.identity.enterAppellantContactDetails);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Enter mobile and click Sign up, I am taken to the send to number page`, async({
    page
  }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(
      page,
      commonContent,
      language
    );
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.smsNotify.sendToNumber}`);
  });

  test(`${language.toUpperCase()} - Enter mobile and click do not sign up, I am taken to the representative page`, async({
    page
  }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(
      page,
      commonContent,
      language
    );
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.representative.representative}`);
  });

  test(`${language.toUpperCase()} - Do not enter mobile and click Sign up, I am taken to the enter mobile page`, async({
    page
  }) => {
    await enterAppellantContactDetailsAndContinue(
      page,
      commonContent,
      language
    );
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    await page.waitForURL(`**/${paths.smsNotify.enterMobile}`);
  });
});

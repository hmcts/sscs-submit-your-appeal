const language = 'en';
const commonContent = require('commonContent')[language];
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Send to number @batch-11`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.identity.enterAppellantContactDetails);
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    page.seeInCurrentUrl(paths.smsNotify.appellantTextReminders);
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I select Yes, I am taken to the sms confirmation page`, ({ page }) => {
    selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    page.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
  });

  test(`${language.toUpperCase()} - When I select No, I am taken to the enter mobile page`, ({ page }) => {
    selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-no');
    page.seeInCurrentUrl(paths.smsNotify.enterMobile);
  });
});

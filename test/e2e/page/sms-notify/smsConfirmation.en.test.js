const language = 'en';
const commonContent = require('commonContent')[language];
const smsConfirmationContent = require(`steps/sms-notify/sms-confirmation/content.${language}`);
const textRemindersContent = require(`steps/sms-notify/text-reminders/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - SMS Confirmation - appellant contact details @batch-11`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.identity.enterAppellantContactDetails);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I click Continue, I am taken to the Representative page`, ({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language);
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    page.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.representative.representative);
  });

  test(`${language.toUpperCase()} - Enter a mobile and click use same number, I see the number in SMS confirmation`, ({
                                                                                                                        page,
                                                                                                                      }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    page.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    expect(page.getByText(`${smsConfirmationContent.mobileNumber}07466748336`)).toBeVisible();
  });

  test(`${language.toUpperCase()} - Enter a mobile, click use different number, I see enter mobile number`, ({ page }) => {
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07466748336');
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-no');
    page.seeInCurrentUrl(paths.smsNotify.enterMobile);
    await page.fill('#enterMobile', '+447123456789');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    expect(page.getByText(`${smsConfirmationContent.mobileNumber}+447123456789`)).toBeVisible();
  });

  test(`${language.toUpperCase()} - Do not enter a mobile, I see the mobile number I provided for enter mobile`, ({
                                                                                                                    page,
                                                                                                                  }) => {
    enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await page.click(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    await page.click(commonContent.continue);
    await page.fill('#enterMobile', '+447987654321');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.smsNotify.smsConfirmation);
    expect(page.getByText(`${smsConfirmationContent.mobileNumber}+447987654321`)).toBeVisible();
  });
})
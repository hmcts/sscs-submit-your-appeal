const language = 'en';
const commonContent = require('../../../commonContent')[language];
const selectors = require('../../../steps/check-your-appeal/selectors');

const appellant = selectors[language].appellant;
const txtMsgRemnders = selectors[language].textMsgReminders;

const appellantPhoneNumberAnswer = `${appellant.phoneNumber} ${selectors.answer}`;
const textMsgRemindersMobileAnswer = `${txtMsgRemnders.mobileNumber} ${selectors.answer}`;
const receiveTxtMsgRemindersAnswer = `${txtMsgRemnders.receiveTxtMsgReminders} ${selectors.answer}`;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { confirmDetailsArePresent, enterDetailsFromNoRepresentativeToEnd, enterDetailsFromStartToNINO } = require('../page-objects/cya/checkYourAppeal');
const { selectDoYouWantToReceiveTextMessageReminders } = require('../page-objects/sms-notify/textReminders');
const { enterAppellantContactDetailsWithMobileAndContinue, enterAppellantContactDetailsAndContinue } = require('../page-objects/identity/appellantDetails');
const { readSMSConfirmationAndContinue } = require('../page-objects/sms-notify/smsConfirmation');
const { enterMobileAndContinue } = require('../page-objects/sms-notify/enterMobile');
const { selectUseSameNumberAndContinue } = require('../page-objects/sms-notify/smsNotify');

test.describe(`${language.toUpperCase()} - Appellant PIP, one month ago, does not attend hearing. @batch-05`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Appellant omits optional phone number, does not sign up for text msg reminders.`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator(appellantPhoneNumberAnswer).first()).toHaveText('Not provided');
    await expect(page.locator(receiveTxtMsgRemindersAnswer).first()).toHaveText('No');
  });

  test(`${language.toUpperCase()} - Appellant omits optional phone number, enters mobile for text msg reminders.`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-yes');
    await enterMobileAndContinue(page, commonContent, '07455678444');
    await readSMSConfirmationAndContinue(page, commonContent);
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator(appellantPhoneNumberAnswer).first()).toHaveText('Not provided');
    await expect(page.locator(textMsgRemindersMobileAnswer).first()).toHaveText('07455678444');
  });

  test(`${language.toUpperCase()} - Appellant adds a phone number and uses it to sign up for text msg reminders.`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);

    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07411738663');
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-yes');
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-yes');
    await readSMSConfirmationAndContinue(page, commonContent);
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator(appellantPhoneNumberAnswer).first()).toHaveText('07411738663');
    await expect(page.locator(textMsgRemindersMobileAnswer).first()).toHaveText('07411738663');
  });

  test(`${language.toUpperCase()} - Appellant adds a phone number, provides a separate number for text msg reminders.`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07411738663');
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-yes');
    await selectUseSameNumberAndContinue(page, commonContent, '#useSameNumber-no');
    await enterMobileAndContinue(page, commonContent, '07411333333');
    await readSMSConfirmationAndContinue(page, commonContent);
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator(appellantPhoneNumberAnswer).first()).toHaveText('07411738663');
    await expect(page.locator(textMsgRemindersMobileAnswer).first()).toHaveText('07411333333');
  });

  test(`${language.toUpperCase()} - Appellant adds a phone number, but does not sign up for text msg reminders.`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07411738663');
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToEnd(page, language, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator(appellantPhoneNumberAnswer).first()).toHaveText('07411738663');
    await expect(page.locator(receiveTxtMsgRemindersAnswer).first()).toHaveText('No');
  });
});

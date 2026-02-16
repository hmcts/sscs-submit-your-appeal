const { test, expect } = require('@playwright/test');

const language = 'en';
const commonContent = require('commonContent')[language];
const {
  confirmDetailsArePresent,
  enterDetailsFromNoRepresentativeToEnd,
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const {
  selectDoYouWantToReceiveTextMessageReminders
} = require('../page-objects/sms-notify/textReminders');
const {
  enterAppellantContactDetailsWithMobileAndContinue,
  enterAppellantContactDetailsAndContinue
} = require('../page-objects/identity/appellantDetails');
const {
  readSMSConfirmationAndContinue
} = require('../page-objects/sms-notify/smsConfirmation');
const {
  enterMobileAndContinue
} = require('../page-objects/sms-notify/enterMobile');
const {
  selectUseSameNumberAndContinue
} = require('../page-objects/sms-notify/smsNotify');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');
const { skipPcq } = require('../page-objects/pcq/pcq');

test.describe(
  `${language.toUpperCase()} - Appellant PIP, one month ago, does not attend hearing.`,
  { tag: '@batch-05' },
  () => {
    test.beforeEach('Create session and user', async({ page }) => {
      await createTheSession(page, language);
    });

    test.afterEach('End session and delete user', async({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - Appellant omits optional phone number, does not sign up for text msg reminders.`, async({
      page
    }) => {
      await enterDetailsFromStartToNINO(page, commonContent, language);
      await enterAppellantContactDetailsAndContinue(
        page,
        commonContent,
        language
      );
      await selectDoYouWantToReceiveTextMessageReminders(
        page,
        commonContent,
        '#doYouWantTextMsgReminders-2'
      );
      await enterDetailsFromNoRepresentativeToEnd(
        page,
        language,
        commonContent
      );
      await skipPcq(page);
      await confirmDetailsArePresent(page, language);
      await expect(page.getByText('Not provided').first()).toBeVisible();
      await expect(page.getByText('No').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Appellant omits optional phone number, enters mobile for text msg reminders.`, async({
      page
    }) => {
      await enterDetailsFromStartToNINO(page, commonContent, language);
      await enterAppellantContactDetailsAndContinue(
        page,
        commonContent,
        language
      );
      await selectDoYouWantToReceiveTextMessageReminders(
        page,
        commonContent,
        '#doYouWantTextMsgReminders'
      );
      await enterMobileAndContinue(page, commonContent, '07455678444');
      await readSMSConfirmationAndContinue(page, commonContent);
      await enterDetailsFromNoRepresentativeToEnd(
        page,
        language,
        commonContent
      );
      await skipPcq(page);
      await confirmDetailsArePresent(page, language);
      await expect(page.getByText('Not provided').first()).toBeVisible();
      await expect(page.getByText('07455678444').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Appellant adds a phone number and uses it to sign up for text msg reminders.`, async({
      page
    }) => {
      await enterDetailsFromStartToNINO(page, commonContent, language);

      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07411738663'
      );
      await selectDoYouWantToReceiveTextMessageReminders(
        page,
        commonContent,
        '#doYouWantTextMsgReminders'
      );
      await selectUseSameNumberAndContinue(
        page,
        commonContent,
        '#useSameNumber'
      );
      await readSMSConfirmationAndContinue(page, commonContent);
      await enterDetailsFromNoRepresentativeToEnd(
        page,
        language,
        commonContent
      );
      await skipPcq(page);
      await confirmDetailsArePresent(page, language);
      await expect(page.getByText('07411738663').first()).toBeVisible();
      await expect(page.getByText('07411738663').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Appellant adds a phone number, provides a separate number for text msg reminders.`, async({
      page
    }) => {
      await enterDetailsFromStartToNINO(page, commonContent, language);
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07411738663'
      );
      await selectDoYouWantToReceiveTextMessageReminders(
        page,
        commonContent,
        '#doYouWantTextMsgReminders'
      );
      await selectUseSameNumberAndContinue(
        page,
        commonContent,
        '#useSameNumber-2'
      );
      await enterMobileAndContinue(page, commonContent, '07411333333');
      await readSMSConfirmationAndContinue(page, commonContent);
      await enterDetailsFromNoRepresentativeToEnd(
        page,
        language,
        commonContent
      );
      await skipPcq(page);
      await confirmDetailsArePresent(page, language);
      await expect(page.getByText('07411738663').first()).toBeVisible();
      await expect(page.getByText('07411333333').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - Appellant adds a phone number, but does not sign up for text msg reminders.`, async({
      page
    }) => {
      await enterDetailsFromStartToNINO(page, commonContent, language);
      await enterAppellantContactDetailsWithMobileAndContinue(
        page,
        commonContent,
        language,
        '07411738663'
      );
      await selectDoYouWantToReceiveTextMessageReminders(
        page,
        commonContent,
        '#doYouWantTextMsgReminders-2'
      );
      await enterDetailsFromNoRepresentativeToEnd(
        page,
        language,
        commonContent
      );
      await skipPcq(page);
      await confirmDetailsArePresent(page, language);
      await expect(page.getByText('07411738663').first()).toBeVisible();
      await expect(page.getByText('No').first()).toBeVisible();
    });
  }
);

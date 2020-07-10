const content = require('commonContent');
const paths = require('paths');
const selectors = require('steps/check-your-appeal/selectors');

const appellant = selectors.appellant;
const txtMsgRemnders = selectors.textMsgReminders;

const appellantPhoneNumberAnswer = `${appellant.phoneNumber} ${selectors.answer}`;
const textMsgRemindersMobileAnswer = `${txtMsgRemnders.mobileNumber} ${selectors.answer}`;
const receiveTxtMsgRemindersAnswer = `${txtMsgRemnders.receiveTxtMsgReminders} ${selectors.answer}`;

const languages = ['en', 'cy'];

Feature('Appellant PIP, one month ago, does not attend hearing. @batch-05');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
    I.seeCurrentUrlEquals(paths.start.benefitType);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];

  Scenario('Appellant omits optional phone number, does not sign up for text msg reminders.', I => {
    I.enterDetailsFromStartToNINO(commonContent);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
    I.see('Not provided', appellantPhoneNumberAnswer);
    I.see('No', receiveTxtMsgRemindersAnswer);
  }).retry(2);

  Scenario('Appellant omits optional phone number, enters mobile for text msg reminders.', I => {
    I.enterDetailsFromStartToNINO(commonContent);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-yes');
    I.enterMobileAndContinue(commonContent, '07455678444');
    I.readSMSConfirmationAndContinue(commonContent);
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
    I.see('Not provided', appellantPhoneNumberAnswer);
    I.see('07455678444', textMsgRemindersMobileAnswer);
  }).retry(2);

  Scenario('Appellant adds a phone number and uses it to sign up for text msg reminders.', I => {
    I.enterDetailsFromStartToNINO(commonContent);

    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, '07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-yes');
    I.selectUseSameNumberAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue(commonContent);
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see('07411738663', textMsgRemindersMobileAnswer);
  }).retry(2);

  Scenario('Appellant adds a phone number, provides a separate number for text msg reminders.', I => {
    I.enterDetailsFromStartToNINO(commonContent);
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, '07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-yes');
    I.selectUseSameNumberAndContinue('#useSameNumber-no');
    I.enterMobileAndContinue(commonContent, '07411333333');
    I.readSMSConfirmationAndContinue(commonContent);
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see('07411333333', textMsgRemindersMobileAnswer);
  }).retry(2);

  Scenario('Appellant adds a phone number, but does not sign up for text msg reminders.', I => {
    I.enterDetailsFromStartToNINO(commonContent);
    I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, '07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
    I.enterDetailsFromNoRepresentativeToEnd(commonContent);
    I.confirmDetailsArePresent(language);
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see('No', receiveTxtMsgRemindersAnswer);
  }).retry(2);
});

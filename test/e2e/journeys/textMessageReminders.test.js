const paths = require('paths');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');

const appellant = selectors.appellant;
const txtMsgRemnders = selectors.textMsgReminders;

const appellantPhoneNumberAnswer = `${appellant.phoneNumber} ${selectors.answer}`;
const textMsgRemindersMobileAnswer = `${txtMsgRemnders.mobileNumber} ${selectors.answer}`;
const receiveTxtMsgRemindersAnswer = `${txtMsgRemnders.receiveTxtMsgReminders} ${selectors.answer}`;

Feature('Appellant PIP, one month ago, does not attend hearing. @batch-05');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Appellant omits optional phone number, does not sign up for text msg reminders.', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToEnd();
  I.confirmDetailsArePresent();
  I.see('Not provided', appellantPhoneNumberAnswer);
  I.see('No', receiveTxtMsgRemindersAnswer);
}).retry(2);

Scenario('Appellant omits optional phone number, enters mobile for text msg reminders.', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.enterMobileAndContinue('07455678444');
  I.readSMSConfirmationAndContinue();
  I.enterDetailsFromNoRepresentativeToEnd();
  I.confirmDetailsArePresent();
  I.see('Not provided', appellantPhoneNumberAnswer);
  I.see('07455678444', textMsgRemindersMobileAnswer);
}).retry(2);

Scenario('Appellant adds a phone number and uses it to sign up for text msg reminders.', I => {
  I.enterDetailsFromStartToNINO();

  I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.selectUseSameNumberAndContinue('#useSameNumber-yes');
  I.readSMSConfirmationAndContinue();
  I.enterDetailsFromNoRepresentativeToEnd();
  I.confirmDetailsArePresent();
  I.see('07411738663', appellantPhoneNumberAnswer);
  I.see('07411738663', textMsgRemindersMobileAnswer);
}).retry(2);

Scenario('Appellant adds a phone number, provides a separate number for text msg reminders.', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.yes);
  I.selectUseSameNumberAndContinue('#useSameNumber-no');
  I.enterMobileAndContinue('07411333333');
  I.readSMSConfirmationAndContinue();
  I.enterDetailsFromNoRepresentativeToEnd();
  I.confirmDetailsArePresent();
  I.see('07411738663', appellantPhoneNumberAnswer);
  I.see('07411333333', textMsgRemindersMobileAnswer);
}).retry(2);

Scenario('Appellant adds a phone number, but does not sign up for text msg reminders.', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToEnd();
  I.confirmDetailsArePresent();
  I.see('07411738663', appellantPhoneNumberAnswer);
  I.see('No', receiveTxtMsgRemindersAnswer);
}).retry(2);

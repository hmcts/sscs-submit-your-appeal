'use strict';

const paths = require('paths');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');

Feature('Appellant PIP, one month ago, does not attend hearing.');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

Scenario('Appellant does not define an optional phone number and does not sign up for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('Not provided', selectors.appellant.phoneNumber);
    I.see('No', selectors.textMsgReminders.receiveTxtMsgReminders);

});

Scenario('Appellant does not define an optional phone number, however, enters mobile for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.enterMobileAndContinue('07455678444');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('Not provided', selectors.appellant.phoneNumber);
    I.see('07455678444', selectors.textMsgReminders.mobileNumber);

});

Scenario('Appellant defines an optional phone number and signs up for text msg reminders using the same number.', (I) => {

    I.enterDetailsFromStartToNINO();

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.selectUseSameNumberAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('07411738663', selectors.appellant.phoneNumber);
    I.see('07411738663', selectors.textMsgReminders.mobileNumber);

});

Scenario('Appellant defines an optional phone number, then provides an additional mobile number for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.selectUseSameNumberAndContinue('#useSameNumber-no');
    I.enterMobileAndContinue('07411333333');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('07411738663', selectors.appellant.phoneNumber);
    I.see('07411333333', selectors.textMsgReminders.mobileNumber);

});

Scenario('Appellant defines an optional phone number, but does not sign up for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('07411738663', selectors.appellant.phoneNumber);
    I.see('No', selectors.textMsgReminders.receiveTxtMsgReminders);

});

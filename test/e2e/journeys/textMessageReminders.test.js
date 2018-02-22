'use strict';

const { formatMobileNumber } = require('utils/stringUtils');
const paths = require('paths');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');

const selectors = require('steps/check-your-appeal/selectors');
const appellantPhoneNumberAnswer   =  `${selectors.appellant.phoneNumber} ${selectors.answer}`;
const textMsgRemindersMobileAnswer =  `${selectors.textMsgReminders.mobileNumber} ${selectors.answer}`;
const receiveTxtMsgRemindersAnswer =  `${selectors.textMsgReminders.receiveTxtMsgReminders} ${selectors.answer}`;

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
    I.see('Not provided', appellantPhoneNumberAnswer);
    I.see('No', receiveTxtMsgRemindersAnswer);

});

Scenario('Appellant does not define an optional phone number, however, enters mobile for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.enterMobileAndContinue('07455678444');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('Not provided', appellantPhoneNumberAnswer);
    I.see(formatMobileNumber('07455678444'), textMsgRemindersMobileAnswer);

});

Scenario('Appellant defines an optional phone number and signs up for text msg reminders using the same number.', (I) => {

    I.enterDetailsFromStartToNINO();

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.yes);
    I.selectUseSameNumberAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see(formatMobileNumber('07411738663'), textMsgRemindersMobileAnswer);

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
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see(formatMobileNumber('07411333333'), textMsgRemindersMobileAnswer);

});

Scenario('Appellant defines an optional phone number, but does not sign up for text msg reminders.', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd();

    I.confirmDetailsArePresent();
    I.see('07411738663', appellantPhoneNumberAnswer);
    I.see('No', receiveTxtMsgRemindersAnswer);

});

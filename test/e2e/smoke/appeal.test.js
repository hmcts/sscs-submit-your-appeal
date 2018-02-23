const { formatMobileNumber } = require('utils/stringUtils');
const startAnAppealContent = require('landing-pages/start-an-appeal/content.en');
const doYouWantTextMsgReminders = require('steps/sms-notify/text-reminders/content.en').fields.doYouWantTextMsgReminders;

const paths = require('paths');
const data = require('test/e2e/data');
const appellant = data.appellant;

const selectors = require('steps/check-your-appeal/selectors');
const appellantPhoneNumberAnswer   = `${selectors.appellant.phoneNumber} ${selectors.answer}`;
const textMsgRemindersMobileAnswer = `${selectors.textMsgReminders.mobileNumber} ${selectors.answer}`;

Feature('Full Journey');

Scenario('Appellant full journey from \'/start-an-appeal\' to the \'/confirmation\' page @smoke', (I) => {

    I.amOnPage(paths.landingPages.startAnAppeal);
    I.click(startAnAppealContent.start);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue(appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd();
    I.confirmDetailsArePresent();
    I.see(appellant.contactDetails.phoneNumber, appellantPhoneNumberAnswer);
    I.see(formatMobileNumber(appellant.contactDetails.phoneNumber), textMsgRemindersMobileAnswer);
    I.signAndSubmit(`${appellant.firstName} ${appellant.lastName}`);
    I.wait(2);
    I.seeCurrentUrlEquals(paths.confirmation);

});

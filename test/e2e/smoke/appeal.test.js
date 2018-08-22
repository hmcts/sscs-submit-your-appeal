const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
// const DateUtils = require('utils/DateUtils');
// const moment = require('moment');
const paths = require('paths');
const mockData = require('test/e2e/data');
// const selectors = require('steps/check-your-appeal/selectors');

const appellant = mockData.appellant;
const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;
// const appellantPhoneNumberAnswer = `${selectors.appellant.phoneNumber} ${selectors.answer}`;
// const txtMsgRemindersMobAnswer =
// `${selectors.textMsgReminders.mobileNumber} ${selectors.answer}`;

Feature('Full Journey');

Scenario('Appellant full journey from /start-an-appeal to the /check-your-appeal page @smoke',
  I => {
    /*    const randomWeekDay = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
    );*/

    I.amOnPage(paths.session.root);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue(appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    /*    I.enterDetailsFromNoRepresentativeToUploadingEvidence();
    await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(randomWeekDay);
    I.confirmDetailsArePresent();
    I.see(appellant.contactDetails.phoneNumber, appellantPhoneNumberAnswer);
    I.see(appellant.contactDetails.phoneNumber, txtMsgRemindersMobAnswer);
    I.seeCurrentUrlEquals(paths.checkYourAppeal);
    I.see('Personal Independence Payment (PIP)');
    I.see('Hearing arrangements');
    I.see('Portuguese');*/
  });

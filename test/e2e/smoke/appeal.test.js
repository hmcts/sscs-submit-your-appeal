const startAnAppealContent = require('landing-pages/start-an-appeal/content.en');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');
const mockData = require('test/e2e/data');
const selectors = require('steps/check-your-appeal/selectors');
const config = require('config');

const hasEvidenceUpload = config.get('features.evidenceUpload.enabled');

const appellant = mockData.appellant;
const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;
const appellantPhoneNumberAnswer = `${selectors.appellant.phoneNumber} ${selectors.answer}`;
const txtMsgRemindersMobAnswer = `${selectors.textMsgReminders.mobileNumber} ${selectors.answer}`;

Feature('Full Journey');

xScenario('Appellant full journey from /start-an-appeal to the /confirmation page @smoke',
  async I => {
    const randomWeekDay = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
    );

    I.amOnPage(paths.landingPages.startAnAppeal);
    I.click(startAnAppealContent.start);
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsWithMobileAndContinue(appellant.contactDetails.phoneNumber);
    I.checkOptionAndContinue(doYouWantTextMsgReminders.yes);
    I.checkOptionAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    I.enterDetailsFromNoRepresentativeToUploadingEvidence();
    if (hasEvidenceUpload) {
      I.uploadAPieceOfEvidence();
    }
    await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(randomWeekDay);
    I.confirmDetailsArePresent();
    I.see(appellant.contactDetails.phoneNumber, appellantPhoneNumberAnswer);
    I.see(appellant.contactDetails.phoneNumber, txtMsgRemindersMobAnswer);
    I.signAndSubmit(`${appellant.firstName} ${appellant.lastName}`);
    I.wait(2);
    I.seeCurrentUrlEquals(paths.confirmation);
  });

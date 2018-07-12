const doYouWantTextMsgRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const doYouWantTextMsgReminders = doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders;
const datesYouCantAttend = selectors.theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend}  ${selectors.change}`;

Feature('Appellant PIP, one month ago, attends hearing with dates cannot attend @batch-01');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Provides date of when they cannot attend the hearing', async I => {
  const randomWeekDay = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence();
  await I.enterDetailsFromAttendingTheHearingToEnd(randomWeekDay);
  I.confirmDetailsArePresent();
  I.see(randomWeekDay.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

Scenario('Provides a single date when they cannot attend the hearing, then edits the date',
  async I => {
    const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
    const randomWeekDayIn6Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(6, 'weeks'));
    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence();
    await I.enterDetailsFromAttendingTheHearingToEnd(randomWeekDayIn5Weeks);
    I.see(randomWeekDayIn5Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

    // Now edit the single date from 10 to 11 weeks.
    I.click('Change', datesYouCantAttendHearingChange);
    I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
    I.click('Continue');
    I.enterDateCantAttendAndContinue(randomWeekDayIn6Weeks, 'Edit');
    I.click('Continue');
    I.see(randomWeekDayIn6Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
  }).retry(1);

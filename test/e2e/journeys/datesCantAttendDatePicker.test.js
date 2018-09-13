const doYouWantTextMsgRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const doYouWantTextMsgReminders = doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders;
const datesYouCantAttend = selectors.theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend}  ${selectors.change}`;

/* eslint-disable max-len */
Feature('Appellant PIP, one month ago, attends hearing with dates cannot attend using date-picker @batch-01');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Selects date of when they cannot attend the hearing', async I => {
  const randomWeekDay = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(9, 'weeks'))
  );
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence();
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(randomWeekDay);
  I.confirmDetailsArePresent();
  I.see(moment(randomWeekDay).format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

Scenario('Selects a date when they cannot attend the hearing, then edits the date', async I => {
  const randomWeekDayIn8Weeks = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(8, 'weeks'))
  );
  const randomWeekDayIn10Weeks = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(10, 'weeks'))
  );

  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence();
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(randomWeekDayIn8Weeks);
  I.see(moment(randomWeekDayIn8Weeks).format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

  // Now edit the single date from 5 to 6 weeks.
  I.click('Change', datesYouCantAttendHearingChange);
  I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
  I.click('Continue');
  await I.deselectDates([randomWeekDayIn8Weeks]);
  I.wait(2);
  await I.selectDates([randomWeekDayIn10Weeks]);
  I.click('Continue');
  I.see(moment(randomWeekDayIn10Weeks).format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

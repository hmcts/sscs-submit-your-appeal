const language = 'en';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const datesYouCantAttend = selectors[language].theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend} ${selectors[language].answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change}`;

/* eslint-disable max-len */
Feature(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with dates cannot attend using date-picker @batch-01`);

Before(({ I }) => {
  I.createTheSession(language);
  I.wait(2);
  I.retry({ retries: 3, minTimeout: 2000 }).seeCurrentUrlEquals(paths.start.benefitType);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Selects date of when they cannot attend the hearing`, async({ I }) => {
  moment().locale(language);

  const randomWeekDay = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(9, 'weeks'))
  );
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, randomWeekDay);
  I.confirmDetailsArePresent(language);
  I.see(DateUtils.formatDate(moment(randomWeekDay), 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

Scenario(`${language.toUpperCase()} - Selects a date when they cannot attend the hearing, then edits the date`, async({ I }) => {
  moment().locale(language);

  const randomWeekDayIn8Weeks = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(8, 'weeks'))
  );
  const randomWeekDayIn10Weeks = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(10, 'weeks'))
  );

  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, randomWeekDayIn8Weeks);
  I.see(DateUtils.formatDate(moment(randomWeekDayIn8Weeks), 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

  // Now edit the single date from 5 to 6 weeks.
  I.click(commonContent.change, datesYouCantAttendHearingChange);
  I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
  I.click(commonContent.continue);
  await I.deselectDates(language, [randomWeekDayIn8Weeks]);
  I.wait(1);
  await I.selectDates(language, [randomWeekDayIn10Weeks]);
  I.click(commonContent.continue);
  I.see(DateUtils.formatDate(moment(randomWeekDayIn10Weeks), 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

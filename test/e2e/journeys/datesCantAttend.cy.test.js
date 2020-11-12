/* eslint-disable no-process-env */

const language = 'cy';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');
const config = require('config');

const datesYouCantAttend = selectors[language].theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend} ${selectors[language].answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change}`;
const aatUrl = 'https://benefit-appeal.aat.platform.hmcts.net';
const actUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

Feature(`${language.toUpperCase()} - PIP, one month ago, attends hearing with dates cannot attend`);

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Provides date of when they cannot attend the hearing`, async I => {
  moment().locale(language);

  const randomWeekDay = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  await I.enterDetailsFromAttendingTheHearingToEnd(commonContent, language, randomWeekDay);
  I.confirmDetailsArePresent(language);
  I.see(DateUtils.formatDate(randomWeekDay, 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

Scenario(`${language.toUpperCase()} - Provides a date when they cannot attend the hearing then edits the date @functional`, async I => {
  moment().locale(language);

  const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
  const randomWeekDayIn6Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(6, 'weeks'));
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  await I.enterDetailsFromAttendingTheHearingToEnd(commonContent, language, randomWeekDayIn5Weeks);
  if (actUrl === aatUrl) I.completePcq();
  I.see(DateUtils.formatDate(randomWeekDayIn5Weeks, 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

  // Now edit the single date from 10 to 11 weeks.
  I.click(commonContent.change, datesYouCantAttendHearingChange);
  I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
  I.click(commonContent.continue);
  I.enterDateCantAttendAndContinue(commonContent, randomWeekDayIn6Weeks, commonContent.edit);
  I.click(commonContent.continue);
  I.see(DateUtils.formatDate(randomWeekDayIn6Weeks, 'DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
}).retry(1);

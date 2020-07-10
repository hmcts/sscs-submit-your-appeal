const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const datesYouCantAttend = selectors.theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend}  ${selectors.change}`;

const languages = ['en', 'cy'];

Feature('PIP, one month ago, attends hearing with dates cannot attend');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

languages.forEach(language => {
  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;

  Scenario(`${language.toUpperCase()} - Provides date of when they cannot attend the hearing`, async I => {
    const randomWeekDay = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
    await I.enterDetailsFromAttendingTheHearingToEnd(commonContent, language, randomWeekDay);
    I.confirmDetailsArePresent(language);
    I.see(randomWeekDay.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
  }).retry(1);

  Scenario(`${language.toUpperCase()} - Provides a date when they cannot attend the hearing then edits the date @functional`, async I => {
    const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
    const randomWeekDayIn6Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(6, 'weeks'));
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
    await I.enterDetailsFromAttendingTheHearingToEnd(commonContent, language, randomWeekDayIn5Weeks);
    I.see(randomWeekDayIn5Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

    // Now edit the single date from 10 to 11 weeks.
    I.click(commonContent.change, datesYouCantAttendHearingChange);
    I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
    I.click(commonContent.continue);
    I.enterDateCantAttendAndContinue(randomWeekDayIn6Weeks, 'Edit');
    I.click(commonContent.continue);
    I.see(randomWeekDayIn6Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);
  }).retry(1);
});

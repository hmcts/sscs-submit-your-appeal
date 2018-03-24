'use strict';

const doYouWantTextMsgReminders = require('steps/sms-notify/text-reminders/content.en.json').fields.doYouWantTextMsgReminders;
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const selectors = require('steps/check-your-appeal/selectors');
const datesYouCantAttendHearingAnswer = `${selectors.theHearing.datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${selectors.theHearing.datesYouCantAttend}  ${selectors.change}`;

Feature('Appellant PIP, one month ago, attends hearing with dates can\'t attend');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

Scenario('Appellant provides date of when they cannot attend the hearing', (I) => {

    const randomWeekDay = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd(randomWeekDay);
    I.confirmDetailsArePresent();
    I.see(randomWeekDay.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

});

Scenario('Appellant provides a single date for when they cannot attend the hearing and later edits it', (I) => {

    const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
    const randomWeekDayIn6Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(6, 'weeks'));

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd(randomWeekDayIn5Weeks);
    I.see(randomWeekDayIn5Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

    // Now edit the single date from 10 to 11 weeks.
    I.click('Change', datesYouCantAttendHearingChange);
    I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
    I.click('Continue');
    I.enterDateCantAttendAndContinue(randomWeekDayIn6Weeks, 'Edit');
    I.click('Continue');
    I.see(randomWeekDayIn6Weeks.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

});

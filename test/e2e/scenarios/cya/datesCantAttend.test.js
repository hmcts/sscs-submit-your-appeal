'use strict';

const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
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

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd();

    I.confirmDetailsArePresent();
    I.see(moment().add(10, 'weeks').format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

});

Scenario('Appellant provides a single date for when they cannot attend the hearing and later edits it', (I) => {

    const tenWeeksFromNow    = moment().add(10, 'weeks');
    const elevenWeeksFromNow = moment().add(11, 'weeks');

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd();
    I.see(tenWeeksFromNow.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

    // Now edit the single date from 10 to 11 weeks.
    I.click('Change', datesYouCantAttendHearingChange);
    I.seeCurrentUrlEquals(paths.hearing.hearingAvailability);
    I.click('Continue');
    I.enterDateCantAttendAndContinue(elevenWeeksFromNow, 'Edit');
    I.click('Continue');
    I.see(elevenWeeksFromNow.format('DD MMMM YYYY'), datesYouCantAttendHearingAnswer);

});

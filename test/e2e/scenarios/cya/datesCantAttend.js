'use strict';

const paths = require('paths');
const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');
const moment = require('moment');

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
    I.see(moment().add(10, 'weeks').format('DD MMMM YYYY'), selectors.theHearing.datesYouCantAttend);

});



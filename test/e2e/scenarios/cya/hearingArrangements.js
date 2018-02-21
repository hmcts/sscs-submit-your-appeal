'use strict';

const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const moment = require('moment');
const paths = require('paths');

const selectors = require('steps/check-your-appeal/selectors');
const datesYouCantAttendHearingAnswer = `${selectors.theHearing.datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${selectors.theHearing.datesYouCantAttend}  ${selectors.change}`;

const fields = require('steps/hearing/arrangements/content.en').fields;


Feature('Appellant PIP, one month ago, attends hearing with support');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

Scenario('Appellant selects sign language interpreter and enters the language type they want', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd([fields.selection.signLanguageInterpreter], [{
        id: '#signLanguageType',
        content: 'A language'
    }]);
    I.confirmDetailsArePresent();
    I.see('A language');

});

Scenario('Appellant selects sign language interpreter and other and then enters the language type they want', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
        [
            fields.selection.signLanguageInterpreter,
            fields.selection.other
        ],
        [{
            id: '#signLanguageType',
            content: 'A language'
        }, {
            id: '#anythingElse',
            content: 'More support'
        }]
    );
    I.confirmDetailsArePresent();
    I.see('A language');
    I.see('More support');

});

Scenario('Appellant selects sign language interpreter, language interpreter and other and then enters the language type they want', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
        [
            fields.selection.languageInterpreter,
            fields.selection.signLanguageInterpreter,
            fields.selection.other
        ],
        [{
            id: '#signLanguageType',
            content: 'A language'
        }, {
            id: '#anythingElse',
            content: 'More support'
        }, {
            id: '#interpreterLanguageType',
            content: 'Another language'
        }]
    );
    I.confirmDetailsArePresent();
    I.see('A language');
    I.see('More support');
    I.see('Another language');

});

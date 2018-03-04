'use strict';

const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const paths = require('paths');
const fields = require('steps/hearing/arrangements/content.en').fields;
const data = require('test/e2e/data');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

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
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd([fields.selection.signLanguage.requested.label], [{
        id: signLanguageTextField,
        content: data.hearing.signLanguageType
    }]);
    I.confirmDetailsArePresent();
    I.see(data.hearing.signLanguageType);

});

Scenario('Appellant selects sign language interpreter and other and then enters the language type they want', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
        [
            fields.selection.signLanguage.requested.label,
            fields.selection.anythingElse.requested.label
        ],
        [{
            id: signLanguageTextField,
            content: data.hearing.signLanguageType
        }, {
            id: anythingElseTextField,
            content: data.hearing.anythingElse
        }]
    );
    I.confirmDetailsArePresent();
    I.see(data.hearing.signLanguageType);
    I.see(data.hearing.anythingElse);

});

Scenario('Appellant selects sign language interpreter, language interpreter and other and then enters the language type they want', (I) => {

    I.enterDetailsFromStartToNINO();
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(textRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
        [
            fields.selection.languageInterpreter.requested.label,
            fields.selection.signLanguage.requested.label,
            fields.selection.anythingElse.requested.label
        ],
        [{
            id: signLanguageTextField,
            content: data.hearing.signLanguageType
        }, {
            id: anythingElseTextField,
            content: data.hearing.anythingElse
        }, {
            id: languageInterpreterTextField,
            content: data.hearing.interpreterLanguageType
        }]
    );
    I.confirmDetailsArePresent();
    I.see(data.hearing.signLanguageType);
    I.see(data.hearing.anythingElse);
    I.see(data.hearing.interpreterLanguageType);

});

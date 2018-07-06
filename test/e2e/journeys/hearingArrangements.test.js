const textRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const paths = require('paths');
const fields = require('steps/hearing/arrangements/content.en').fields;
const testData = require('test/e2e/data');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

Feature('Appellant PIP, one month ago, attends hearing with support @batch-02');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Selects sign language interpreter and enters a language', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToSendingEvidence();
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    [ fields.selection.signLanguage.requested.label ],
    [{ id: signLanguageTextField, content: testData.hearing.signLanguageType }]);
  I.confirmDetailsArePresent();
  I.see(testData.hearing.signLanguageType);
}).retry(1);

Scenario('Selects sign language interpreter and other, enters a language', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToSendingEvidence();
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    [
      fields.selection.signLanguage.requested.label,
      fields.selection.anythingElse.requested.label
    ],
    [
      { id: signLanguageTextField, content: testData.hearing.signLanguageType },
      { id: anythingElseTextField, content: testData.hearing.anythingElse }
    ]
  );
  I.confirmDetailsArePresent();
  I.see(testData.hearing.signLanguageType);
  I.see(testData.hearing.anythingElse);
}).retry(1);

Scenario('Selects sign language interpreter, language interpreter, other, enters a language', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(
    textRemindersContent.fields.doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToSendingEvidence();
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    [
      fields.selection.languageInterpreter.requested.label,
      fields.selection.signLanguage.requested.label,
      fields.selection.anythingElse.requested.label
    ],
    [
      {
        id: signLanguageTextField,
        content: testData.hearing.signLanguageType
      }, {
        id: anythingElseTextField,
        content: testData.hearing.anythingElse
      }, {
        id: languageInterpreterTextField,
        content: testData.hearing.interpreterLanguageType
      }
    ]
  );
  I.confirmDetailsArePresent();
  I.see(testData.hearing.signLanguageType);
  I.see(testData.hearing.anythingElse);
  I.see(testData.hearing.interpreterLanguageType);
}).retry(1);

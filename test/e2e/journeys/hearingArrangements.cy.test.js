const language = 'cy';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const testData = require('test/e2e/data.en');
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

Feature(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with support @batch-02`);

Before(({ I }) => {
  I.createTheSession(language);
  I.wait(2);
  I.retry({ retries: 3, minTimeout: 2000 }).seeCurrentUrlEquals(paths.start.benefitType);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Selects sign language interpreter and enters a language`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    commonContent, language,
    [ hearingArrangementsContent.fields.selection.signLanguage.requested.label ],
    [{ id: signLanguageTextField, content: testData.hearing.signLanguageType }]);
  I.confirmDetailsArePresent(language);
  I.see(testData.hearing.signLanguageType);
}).retry(1);

Scenario(`${language.toUpperCase()} - Selects sign language interpreter and other, enters a language`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    commonContent, language,
    [
      hearingArrangementsContent.fields.selection.signLanguage.requested.label,
      hearingArrangementsContent.fields.selection.anythingElse.requested.label
    ],
    [
      { id: signLanguageTextField, content: testData.hearing.signLanguageType },
      { id: anythingElseTextField, content: testData.hearing.anythingElse }
    ]
  );
  I.confirmDetailsArePresent(language);
  I.see(testData.hearing.signLanguageType);
  I.see(testData.hearing.anythingElse);
}).retry(1);

Scenario(`${language.toUpperCase()} - Selects sign language interpreter, language interpreter, other, enters a language`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
    commonContent, language,
    [
      hearingArrangementsContent.fields.selection.languageInterpreter.requested.label,
      hearingArrangementsContent.fields.selection.signLanguage.requested.label,
      hearingArrangementsContent.fields.selection.anythingElse.requested.label
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
  I.confirmDetailsArePresent(language);
  I.see(testData.hearing.signLanguageType);
  I.see(testData.hearing.anythingElse);
  I.see(testData.hearing.interpreterLanguageType);
}).retry(1);

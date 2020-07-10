const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const hearingArrangementsContentEn = require('steps/hearing/arrangements/content.en');
const hearingArrangementsContentCy = require('steps/hearing/arrangements/content.cy');
const testData = require('test/e2e/data');
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

const languages = ['en', 'cy'];

Feature('Appellant PIP, one month ago, attends hearing with support @batch-02');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
    I.seeCurrentUrlEquals(paths.start.benefitType);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;
  const hearingArrangementsContent = language === 'en' ? hearingArrangementsContentEn : hearingArrangementsContentCy;

  Scenario(`${language.toUpperCase()} - Selects sign language interpreter and enters a language`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
    I.enterDetailsFromAttendingTheHearingWithSupportToEnd(
      commonContent, language,
      [ hearingArrangementsContent.fields.selection.signLanguage.requested.label ],
      [{ id: signLanguageTextField, content: testData.hearing.signLanguageType }]);
    I.confirmDetailsArePresent(language);
    I.see(testData.hearing.signLanguageType);
  }).retry(1);

  Scenario(`${language.toUpperCase()} - Selects sign language interpreter and other, enters a language`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
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

  Scenario(`${language.toUpperCase()} - Selects sign language interpreter, language interpreter, other, enters a language`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
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
});

const language = 'en';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const testData = require('test/e2e/data.en');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const {
  confirmDetailsArePresent,
  enterDetailsFromAttendingTheHearingWithSupportToEnd,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const { selectDoYouWantToReceiveTextMessageReminders } = require('../page-objects/sms-notify/textReminders');
const { enterAppellantContactDetailsAndContinue } = require('../page-objects/identity/appellantDetails');

test.describe(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with support @batch-02`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Selects sign language interpreter and enters a language`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingWithSupportToEnd(
      page,
      commonContent,
      language,
      [hearingArrangementsContent.fields.selection.signLanguage.requested.label],
      [{ id: signLanguageTextField, content: testData.hearing.signLanguageType }]
    );
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(testData.hearing.signLanguageType)).toBeVisible();
  });

  test(`${language.toUpperCase()} - Selects sign language interpreter and other, enters a language`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingWithSupportToEnd(
      page,
      commonContent,
      language,
      [hearingArrangementsContent.fields.selection.signLanguage.requested.label, hearingArrangementsContent.fields.selection.anythingElse.requested.label],
      [
        { id: signLanguageTextField, content: testData.hearing.signLanguageType },
        { id: anythingElseTextField, content: testData.hearing.anythingElse }
      ]
    );
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(testData.hearing.signLanguageType)).toBeVisible();
    await expect(page.getByText(testData.hearing.anythingElse)).toBeVisible();
  });

  test(`${language.toUpperCase()} - Selects sign language interpreter, language interpreter, other, enters a language`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingWithSupportToEnd(
      page,
      commonContent,
      language,
      [
        hearingArrangementsContent.fields.selection.languageInterpreter.requested.label,
        hearingArrangementsContent.fields.selection.signLanguage.requested.label,
        hearingArrangementsContent.fields.selection.anythingElse.requested.label
      ],
      [
        {
          id: signLanguageTextField,
          content: testData.hearing.signLanguageType
        },
        {
          id: anythingElseTextField,
          content: testData.hearing.anythingElse
        },
        {
          id: languageInterpreterTextField,
          content: testData.hearing.interpreterLanguageType
        }
      ]
    );
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(testData.hearing.signLanguageType)).toBeVisible();
    await expect(page.getByText(testData.hearing.anythingElse)).toBeVisible();
    await expect(page.getByText(testData.hearing.interpreterLanguageType)).toBeVisible();
  });
});

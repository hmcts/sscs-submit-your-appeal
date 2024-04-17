const language = 'cy';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;
const testData = require('test/e2e/data.en');

const twoReasons = [
  reasons[0],
  reasons[1]
];
const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const reasonForAppealing = selectors[language].reasonsForAppealing.reasons;
const reasonForAppealingChange = `${reasonForAppealing}-1 ${selectors.change}`;

Feature(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with reasons for appealing one page form`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Adds reasons for appealing and sees them in check your answers`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.addAReasonForAppealing(
    language,
    `#items-1 ${whatYouDisagreeWithField}-1`,
    `#items-1 ${reasonForAppealingField}-1`,
    reasons[1]
  );
  I.click(commonContent.continue);
  I.enterAnythingElseAndContinue(language, commonContent, testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(language, commonContent, '#evidenceProvide-yes');
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
  I.confirmDetailsArePresent(language);
  twoReasons.forEach(({ reason }) => {
    I.see(reason.whatYouDisagreeWith);
    I.see(reason.reasonForAppealing);
  });
});

Scenario(`${language.toUpperCase()} - Enters a reason for appealing, then edits the reason`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.addAReasonForAppealing(
    language,
    `#items-1 ${whatYouDisagreeWithField}-1`,
    `#items-1 ${reasonForAppealingField}-1`,
    reasons[1]
  );
  I.click(commonContent.continue);
  I.enterAnythingElseAndContinue(language, commonContent, testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(language, commonContent, '#evidenceProvide-yes');
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
  I.confirmDetailsArePresent(language);

  twoReasons.forEach(({ reason }) => {
    I.see(reason.whatYouDisagreeWith);
    I.see(reason.reasonForAppealing);
  });

  // Now Change the reason a different answer.
  I.click(commonContent.change, reasonForAppealingChange);
  I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');

  I.addAReasonForAppealing(
    language,
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[2]
  );
  I.click(commonContent.continue);
  I.click(commonContent.continue);
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

Scenario(`${language.toUpperCase()} - Enters a reason for appealing, then removes the reason and sees errors`, ({ I }) => {
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click(commonContent.continue);
  I.enterAnythingElseAndContinue(language, commonContent, testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(language, commonContent, '#evidenceProvide-yes');
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
  I.confirmDetailsArePresent(language);
  I.see(reasons[0].whatYouDisagreeWith);
  I.see(reasons[0].reasonForAppealing);

  // Now Change the reason a different answer.
  I.click(commonContent.change, reasonForAppealingChange);
  I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');

  I.addAReasonForAppealing(
    language,
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    {
      whatYouDisagreeWith: '',
      reasonForAppealing: ''
    }
  );
  I.click(commonContent.continue);
  I.seeElement('#error-summary-title');
  I.addAReasonForAppealing(
    language,
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[2]
  );
  I.click(commonContent.continue);
  I.click(commonContent.continue);
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

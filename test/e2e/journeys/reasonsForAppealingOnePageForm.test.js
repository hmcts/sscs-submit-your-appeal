const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');

const reasonForAppealing = selectors.reasonsForAppealing.reasons;
const reasonForAppealingChange = `${reasonForAppealing}-1  ${selectors.change}`;

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

const testData = require('test/e2e/data');
const representative = require('steps/representative/representative/content.en');
const evidenceProvide = require('steps/reasons-for-appealing/evidence-provide/content.en.json');

const twoReasons = [
  reasons[0],
  reasons[1]
];
const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const languages = ['en', 'cy'];

Feature('Appellant PIP, one month ago, attends hearing with reasons for appealing one page form');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

languages.forEach(language => {
  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;

  Scenario(`${language.toUpperCase()} - Adds reasons for appealing and sees them in check your answers`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.selectDoYouHaveARepresentativeAndContinue(commonContent, representative.fields.hasRepresentative.no);
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    I.addAReasonForAppealing(
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      reasons[1]
    );
    I.click(commonContent.continue);
    I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      I.readSendingEvidenceAndContinue();
    }
    if (evidenceUploadEnabled) {
      I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
      I.uploadAPieceOfEvidence();
      I.enterDescription('Some description of the evidence');
    }
    I.enterDoYouWantToAttendTheHearing('No');
    I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();
    I.confirmDetailsArePresent();
    twoReasons.forEach(reason => {
      I.see(reason.whatYouDisagreeWith);
      I.see(reason.reasonForAppealing);
    });
  });

  Scenario(`${language.toUpperCase()} - Enters a reason for appealing, then edits the reason`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.selectDoYouHaveARepresentativeAndContinue(commonContent, representative.fields.hasRepresentative.no);
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    I.addAReasonForAppealing(
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      reasons[1]
    );
    I.click(commonContent.continue);
    I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      I.readSendingEvidenceAndContinue();
    }
    if (evidenceUploadEnabled) {
      I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
      I.uploadAPieceOfEvidence();
      I.enterDescription('Some description of the evidence');
    }
    I.enterDoYouWantToAttendTheHearing('No');
    I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();
    I.confirmDetailsArePresent();

    twoReasons.forEach(reason => {
      I.see(reason.whatYouDisagreeWith);
      I.see(reason.reasonForAppealing);
    });

    // Now Change the reason a different answer.
    I.click(commonContent.change, reasonForAppealingChange);
    I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);
    I.waitForElement('#items-0');

    I.addAReasonForAppealing(
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

  Scenario(`${language.toUpperCase()} - Enters a reason for appealing, then removes the reason and sees errors`, I => {
    I.enterDetailsFromStartToNINO(commonContent, language);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.selectDoYouHaveARepresentativeAndContinue(commonContent, representative.fields.hasRepresentative.no);
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    I.click(commonContent.continue);
    I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      I.readSendingEvidenceAndContinue();
    }
    if (evidenceUploadEnabled) {
      I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
      I.uploadAPieceOfEvidence();
      I.enterDescription('Some description of the evidence');
    }
    I.enterDoYouWantToAttendTheHearing('No');
    I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();
    I.confirmDetailsArePresent();
    I.see(reasons[0].whatYouDisagreeWith);
    I.see(reasons[0].reasonForAppealing);

    // Now Change the reason a different answer.
    I.click(commonContent.change, reasonForAppealingChange);
    I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);
    I.waitForElement('#items-0');

    I.addAReasonForAppealing(
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
});

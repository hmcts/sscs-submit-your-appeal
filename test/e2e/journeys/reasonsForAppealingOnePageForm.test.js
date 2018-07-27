const doYouWantTextMsgRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');

const doYouWantTextMsgReminders = doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders;
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

Feature(`Appellant PIP, one month ago, attends hearing 
with reasons for appealing one page form @batch-06`);

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Adds reasons for appealing and sees them in check your answers', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
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
  I.click('Continue');
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

Scenario('Enters a reason for appealing, then edits the reason', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
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
  I.click('Continue');
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
  I.click('Change', reasonForAppealingChange);
  I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');

  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[2]
  );
  I.click('Continue');
  I.click('Continue');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

Scenario('Enters a reason for appealing, then removes the reason and sees errors', I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click('Continue');
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
  I.click('Change', reasonForAppealingChange);
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
  I.click('Continue');
  I.seeElement('#error-summary-heading');
  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[2]
  );
  I.click('Continue');
  I.click('Continue');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

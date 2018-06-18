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

const twoReasons = [
  reasons[0],
  reasons[1]
];

Feature('Appellant PIP, one month ago, attends hearing with reasons for appealing one page form');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Adds reasons for appealing and sees them in check your answers', async I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[0]
  );
  I.addAReasonForAppealing(
    `#items-1 ${whatYouDisagreeWithField}`,
    `#items-1 ${reasonForAppealingField}`,
    reasons[1]
  );
  I.click('Continue');
  I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
  I.readSendingEvidenceAndContinue();
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
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[0]
  );
  I.addAReasonForAppealing(
    `#items-1 ${whatYouDisagreeWithField}`,
    `#items-1 ${reasonForAppealingField}`,
    reasons[1]
  );
  I.click('Continue');
  I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
  I.readSendingEvidenceAndContinue();
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
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[2]
  );
  I.click('Continue');
  I.click('Continue');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

Scenario('Enters a reason for appealing, then removes the reason and sees errors', async I => {
  I.enterDetailsFromStartToNINO();
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
  I.addAReasonForAppealingAndThenClickAddAnother(
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[0]
  );
  I.addAReasonForAppealing(
    `#items-1 ${whatYouDisagreeWithField}`,
    `#items-1 ${reasonForAppealingField}`,
    reasons[1]
  );
  I.click('Continue');
  I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
  I.readSendingEvidenceAndContinue();
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
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    {
      whatYouDisagreeWith: '',
      reasonForAppealing: ''
    }
  );
  I.click('Continue');
  await I.hasErrorClass('#items-0');
  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[2]
  );
  I.click('Continue');
  I.click('Continue');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

const doYouWantTextMsgRemindersContent = require('steps/sms-notify/text-reminders/content.en.json');
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const doYouWantTextMsgReminders = doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders;
const datesYouCantAttend = selectors.theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend}  ${selectors.answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend}  ${selectors.change}`;

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

Scenario('Selects a date when they cannot attend the hearing, then edits the date', async I => {
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
  I.click('Change', datesYouCantAttendHearingChange);
  I.seeCurrentUrlEquals(paths.reasonsForAppealing.reasonForAppealing);

  twoReasons.forEach(reason => {
    I.see(reason.whatYouDisagreeWith);
    I.see(reason.reasonForAppealing);
  });

  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[2]
  );
  I.click('Continue');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.dontSee(reasons[0].reasonForAppealing);
  I.see(reasons[2].whatYouDisagreeWith);
  I.see(reasons[2].reasonForAppealing);
});

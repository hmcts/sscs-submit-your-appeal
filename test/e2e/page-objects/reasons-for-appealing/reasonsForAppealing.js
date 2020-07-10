function enterAnythingElseAndContinue(commonContent, anythingElse) {
  const I = this;

  I.fillField('#otherReasonForAppealing', anythingElse);
  I.click(commonContent.continue);
}

function enterReasonForAppealAndContinue(reason, link) {
  const I = this;

  I.click(link);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reason.whatYouDisagreeWith);
  I.fillField('textarea[name="item.reasonForAppealing"]', reason.reasonForAppealing);
  I.click('Continue');
}

function addReasonsForAppealingAndContinue(reason, link) {
  const I = this;

  I.enterReasonForAppealAndContinue(reason, link);
  I.click('Continue');
}

module.exports = {
  enterReasonForAppealAndContinue,
  enterAnythingElseAndContinue,
  addReasonsForAppealingAndContinue
};

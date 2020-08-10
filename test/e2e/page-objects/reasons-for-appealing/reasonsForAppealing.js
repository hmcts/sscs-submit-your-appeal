function enterAnythingElseAndContinue(commonContent, anythingElse) {
  const I = this;

  I.fillField('#otherReasonForAppealing', anythingElse);
  I.click(commonContent.continue);
}

function enterReasonForAppealAndContinue(commonContent, reason, link) {
  const I = this;

  I.click(link);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reason.whatYouDisagreeWith);
  I.fillField('textarea[name="item.reasonForAppealing"]', reason.reasonForAppealing);
  I.click(commonContent.continue);
}

function addReasonsForAppealingAndContinue(commonContent, reason, link) {
  const I = this;

  I.enterReasonForAppealAndContinue(commonContent, reason, link);
  I.click(commonContent.continue);
}

module.exports = {
  enterAnythingElseAndContinue,
  enterReasonForAppealAndContinue,
  addReasonsForAppealingAndContinue
};

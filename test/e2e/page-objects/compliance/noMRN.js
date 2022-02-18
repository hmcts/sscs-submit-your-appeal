function enterReasonForNoMRNAndContinue(commonContent, reason) {
  const I = this;

  I.fillField('#reasonForNoMRN', reason);
  I.click(commonContent.continue);
}

function enterReasonForNoMRNAndContinueAfterSignIn(commonContent, reason) {
  const I = this;

  I.fillField('#reasonForNoMRN', reason);
  I.click(commonContent.saveAndContinue);
}

module.exports = { enterReasonForNoMRNAndContinue, enterReasonForNoMRNAndContinueAfterSignIn };

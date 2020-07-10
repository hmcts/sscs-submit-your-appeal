function enterReasonForNoMRNAndContinue(commonContent, reason) {
  const I = this;

  I.fillField('#reasonForNoMRN', reason);
  I.click(commonContent.continue);
}

module.exports = { enterReasonForNoMRNAndContinue };

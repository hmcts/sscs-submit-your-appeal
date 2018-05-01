function enterReasonForNoMRNAndContinue(reason) {
  const I = this;

  I.fillField('#reasonForNoMRN', reason);
  I.click('Continue');
}

module.exports = { enterReasonForNoMRNAndContinue };

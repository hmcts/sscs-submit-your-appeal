function enterReasonsForBeingLateAndContinue(commonContent, reason) {
  const I = this;

  I.fillField('#reasonForBeingLate', reason);
  I.click(commonContent.continue);
}

module.exports = { enterReasonsForBeingLateAndContinue };

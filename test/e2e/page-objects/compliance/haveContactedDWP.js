function selectHaveYouContactedDWPAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectHaveYouContactedDWPAndContinueAfterSignIn(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

function selectHaveYouGotAMRNAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectHaveYouGotAMRNAndContinueAfterSignIn(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouGotAMRNAndContinue,selectHaveYouGotAMRNAndContinueAfterSignIn  };

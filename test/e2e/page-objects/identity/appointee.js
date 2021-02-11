function selectAreYouAnAppointeeAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectAreYouAnAppointeeAndContinueAfterSignIn(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectAreYouAnAppointeeAndContinue, selectAreYouAnAppointeeAndContinueAfterSignIn };

function selectHaveYouGotAMRNAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectHaveYouGotAMRNAndContinue };

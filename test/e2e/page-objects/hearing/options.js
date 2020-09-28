function selectHearingOptionsAndContinue(commonContent, option) {
  const I = this;

  I.waitForElement('#selectOptions');
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectHearingOptionsAndContinue };

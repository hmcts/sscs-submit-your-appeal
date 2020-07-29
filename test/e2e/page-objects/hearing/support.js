function selectDoYouNeedSupportAndContinue(commonContent, option) {
  const I = this;

  I.waitForElement('#arrangements');
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectDoYouNeedSupportAndContinue };

function selectDoYouNeedSupportAndContinue(option) {
  const I = this;

  I.waitForElement('#arrangements');
  I.checkOption(option);
  I.click('Continue');
}

module.exports = { selectDoYouNeedSupportAndContinue };

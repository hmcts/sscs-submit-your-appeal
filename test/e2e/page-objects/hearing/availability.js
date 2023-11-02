function selectHearingAvailabilityAndContinue(commonContent, option) {
  const I = this;

  I.waitForElement('#scheduleHearing');
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectHearingAvailabilityAndContinue };

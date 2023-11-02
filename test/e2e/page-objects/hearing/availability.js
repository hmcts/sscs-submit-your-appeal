function selectHearingAvailabilityAndContinue(commonContent, option) {
  const I = this;

  I.waitForElement('#scheduleHearing');
  I.checkOption(option);
  //  for some reason the continue is not sending to next page, instead it is remaining on '/hearing-availability'
  I.click(commonContent.continue);
}

module.exports = { selectHearingAvailabilityAndContinue };

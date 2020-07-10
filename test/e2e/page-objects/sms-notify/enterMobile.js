function enterMobileAndContinue(commonContent, mobileNumber) {
  const I = this;

  I.fillField('enterMobile', mobileNumber);
  I.click(commonContent.continue);
}

module.exports = { enterMobileAndContinue };

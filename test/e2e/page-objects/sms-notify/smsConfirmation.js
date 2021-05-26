function readSMSConfirmationAndContinue(commonContent) {
  const I = this;
  I.wait(3);
  I.click(commonContent.continue);
}

module.exports = { readSMSConfirmationAndContinue };

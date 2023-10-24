function readSMSConfirmationAndContinue(commonContent) {
  const I = this;
  I.wait(1);
  I.click(commonContent.continue);
}

module.exports = { readSMSConfirmationAndContinue };

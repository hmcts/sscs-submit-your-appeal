function checkOptionAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}


function checkPCQOptionAndContinue(option) {
  const I = this;

  I.checkOption(option);
  I.click('Continue');
}

module.exports = { checkOptionAndContinue,
  checkPCQOptionAndContinue };

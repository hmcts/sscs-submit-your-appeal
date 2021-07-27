function checkOptionAndContinue(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.continue);
}

function checkOptionAndContinueAfterSignIn(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}


function checkPCQOptionAndContinue(option) {
  const I = this;

  I.checkOption(option);
  I.click('Continue');
}

function checkCYPCQOptionAndContinue(option) {
  const I = this;

  I.checkOption(option);
  I.click('Parhau');
}


module.exports = { checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue };

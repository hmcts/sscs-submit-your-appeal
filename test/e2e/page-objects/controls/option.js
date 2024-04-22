function checkOptionAndContinue(commonContent, option) {
  const I = this;

  I.wait(10);
  I.checkOption(option);
  I.waitForClickable(commonContent.continue, 3);
  I.click(commonContent.continue);
}

function checkOptionAndContinueAfterSignIn(commonContent, option) {
  const I = this;

  I.wait(10);
  I.checkOption(option);
  I.waitForClickable(commonContent.saveAndContinue, 3);
  I.click(commonContent.saveAndContinue);
}


function checkPCQOptionAndContinue(option) {
  const I = this;

  I.wait(10);
  I.checkOption(option);
  I.waitForClickable('Continue', 3);
  I.click('Continue');
}

function checkCYPCQOptionAndContinue(option) {
  const I = this;

  I.wait(10);
  I.checkOption(option);
  I.waitForClickable('Parhau', 3);
  I.click('Parhau');
}


module.exports = { checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue };

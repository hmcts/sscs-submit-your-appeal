function enterPostcodeAndContinue(commonContent, postcode) {
  const I = this;

  I.fillField({ id: 'postcode' }, postcode);
  I.click(commonContent.continue);
  I.wait(1);
}

function enterPostcodeAndContinueAfterSignIn(commonContent, postcode) {
  const I = this;

  I.fillField({ id: 'postcode' }, postcode);
  I.click(commonContent.saveAndContinue);
  I.wait(1);
}

module.exports = { enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn };

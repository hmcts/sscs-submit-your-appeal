function enterPostcodeAndContinue(postcode) {
  const I = this;

  I.waitForElement('#postcode', 5);
  I.fillField('#postcode', postcode);
  I.click('Continue');
}

module.exports = { enterPostcodeAndContinue };

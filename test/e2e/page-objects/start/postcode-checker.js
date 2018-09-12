function enterPostcodeAndContinue(postcode) {
  const I = this;
  I.waitForElement({ id: 'postcode' }, 5);
  I.fillField({
    id: 'postcode'
  }, postcode);
  I.click('Continue');
}

module.exports = {
  enterPostcodeAndContinue
};
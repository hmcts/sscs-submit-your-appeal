function enterPostcodeAndContinue(postcode) {
  const I = this;

  I.fillField({
    id: 'postcode'
  }, postcode);
  I.click('Continue');
}

module.exports = {
  enterPostcodeAndContinue
};
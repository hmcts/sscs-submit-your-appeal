function enterPostcodeAndContinue(postcode) {
  const I = this;

  /* global locate*/
  /* eslint no-undef: "error"*/
  const locator = locate('input')
    .withAttr({ id: 'postcode' });
  I.fillField(locator, postcode);
  I.click('Continue');
}

module.exports = {
  enterPostcodeAndContinue
};
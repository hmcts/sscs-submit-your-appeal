const paths = require('paths');

function enterPostcodeAndContinue(postcode) {
  const I = this;

  I.seeCurrentUrlEquals(paths.start.postcodeCheck);

  I.waitForElement('#postcode', 5);
  I.fillField('#postcode', postcode);
  I.click('Continue');
}

module.exports = { enterPostcodeAndContinue };

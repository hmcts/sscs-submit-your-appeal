function enterPostcodeAndContinue(postcode) {

    const I = this;

    I.fillField('#postcode', postcode);
    I.click('Continue');
}

module.exports = { enterPostcodeAndContinue };

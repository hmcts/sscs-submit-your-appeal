
function enterBenefitTypeAndContinue(type) {

    const I = this;

    I.amOnPage('/benefits-type/');
    I.fillField({css : '.form-group input'}, type);
    I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

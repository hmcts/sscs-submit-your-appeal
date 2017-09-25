
function enterBenefitTypeAndContinue(type) {

    const I = this;

    I.amOnPage('/benefit-type');
    I.fillField('benefitType', type);
    I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

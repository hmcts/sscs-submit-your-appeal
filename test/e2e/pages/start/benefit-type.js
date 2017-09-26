
function enterBenefitTypeAndContinue(type) {

    const I = this;

    I.fillField('BenefitType_benefitType', type);
    I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

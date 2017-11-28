function enterBenefitTypeAndContinue(type) {

    const I = this;

    I.wait(0.5);
    I.fillField('#benefitType', type);
    I.click('#benefitType__option--0');
    I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

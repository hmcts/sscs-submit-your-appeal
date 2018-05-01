function enterBenefitTypeAndContinue(type) {
  const I = this;

  I.fillField('#benefitType', type);
  I.click('#benefitType__option--0');
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

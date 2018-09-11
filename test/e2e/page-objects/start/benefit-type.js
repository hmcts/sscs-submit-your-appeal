function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.fillField({ id: 'benefitType' }, type);
  I.click({ id: 'benefitType__option--0' });
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

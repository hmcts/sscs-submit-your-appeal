function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.fillField({ id: 'benefitType' }, type);
  I.waitForElement('#benefitType__option--0', 5);
  I.click('#benefitType__option--0');
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

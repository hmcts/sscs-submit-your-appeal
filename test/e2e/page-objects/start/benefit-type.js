function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.waitForElement('#benefitType', 5);
  I.fillField('#benefitType', type);
  I.waitForElement('#benefitType__option--0', 5);
  I.click('#benefitType__option--0');
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

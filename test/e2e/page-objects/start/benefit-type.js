function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.wait(3);
  I.fillField('#benefitType', type);
  I.wait(3);
  I.click('#benefitType__option--0');
  I.wait(3);
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

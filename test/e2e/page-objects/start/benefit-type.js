function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.wait(1);
  I.fillField('#benefitType', type);
  I.wait(2);
  I.click('#benefitType__option--0');
  I.wait(1);
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

function enterBenefitTypeAndContinue(type) {
  const I = this;
  I.retry({ retries: 3, minTimeout: 2000 }).fillField({ id: 'benefitType' }, type);
  I.click({ id: 'benefitType__option--0' });
  I.click('Continue');
}

module.exports = { enterBenefitTypeAndContinue };

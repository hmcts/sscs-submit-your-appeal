function enterBenefitTypeAndContinue(commonContent, type) {
  const I = this;
  I.retry({ retries: 3, minTimeout: 2000 }).fillField({ id: 'benefitType' }, type);
  I.click('#benefitType__option--0');
  I.click(commonContent.continue);
}

module.exports = { enterBenefitTypeAndContinue };

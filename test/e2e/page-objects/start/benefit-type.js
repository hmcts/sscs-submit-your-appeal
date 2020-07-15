function enterBenefitTypeAndContinue(commonContent, type) {
  const I = this;
  I.retry({ retries: 3, minTimeout: 2000 }).fillField({ id: 'benefitType' }, type);
  I.retry({ retries: 2, minTimeout: 2000 }).click('#benefitType__option--0');
  I.click(commonContent.continue);
}

module.exports = { enterBenefitTypeAndContinue };

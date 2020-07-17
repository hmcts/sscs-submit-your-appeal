async function enterBenefitTypeAndContinue(commonContent, type) {
  const I = this;

  await I.retry({ retries: 3, minTimeout: 2000 }).fillField({ id: 'benefitType' }, type);
  await I.click({ id: 'benefitType__option--0' });
  await I.click(commonContent.continue);
}

module.exports = { enterBenefitTypeAndContinue };

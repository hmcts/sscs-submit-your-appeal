function selectTelephoneHearingOptionsAndContinue(commonContent) {
  const I = this;

  I.waitForElement('#selectOptions', 5);
  I.checkOption('//input[@id=\'selectOptions.telephone.requested-true\']');
  I.fillField('//input[@id=\'selectOptions.telephone.phoneNumber\']', '07534345634');
  I.click(commonContent.continue);
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

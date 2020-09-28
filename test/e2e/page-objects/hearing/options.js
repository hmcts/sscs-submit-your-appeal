function selectTelephoneHearingOptionsAndContinue(commonContent) {
  const I = this;

  I.waitForElement('#selectOptions', 5);
  I.checkOption('//input[@id=\'selectOptions.option-telephone\']');
  I.fillField('//input[@id=\'selectOptions.telephone\']', '08883474455');
  I.click(commonContent.continue);
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

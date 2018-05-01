function selectUseSameNumberAndContinue(option) {
  const I = this;

  I.checkOption(option);
  I.click('Continue');
}

module.exports = { selectUseSameNumberAndContinue };

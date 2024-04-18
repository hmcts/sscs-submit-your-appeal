function selectDoYouHaveARepresentativeAndContinue(commonContent, option) {
  const I = this;

  I.wait(5);
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectDoYouHaveARepresentativeAndContinue };

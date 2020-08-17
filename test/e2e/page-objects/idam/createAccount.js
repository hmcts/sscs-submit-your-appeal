function selectIfYouWantToCreateAccount(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.scrollIntoView(commonContent.continue, 5, 5);
  I.click(commonContent.continue);
}

module.exports = { selectIfYouWantToCreateAccount };

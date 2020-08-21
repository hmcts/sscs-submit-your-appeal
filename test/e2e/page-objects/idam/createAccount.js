function selectIfYouWantToCreateAccount(commonContent, option) {
  const I = this;

  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.continue);
}

module.exports = { selectIfYouWantToCreateAccount };

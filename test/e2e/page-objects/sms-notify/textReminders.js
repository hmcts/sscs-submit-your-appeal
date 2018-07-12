function selectDoYouWantToReceiveTextMessageReminders(option) {
  const I = this;

  I.waitForElement('#doYouWantTextMsgReminders');
  I.checkOption(option);
  I.click('Continue');
}

module.exports = { selectDoYouWantToReceiveTextMessageReminders };

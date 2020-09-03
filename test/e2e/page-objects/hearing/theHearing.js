function enterDoYouWantToAttendTheHearing(commonContent, option) {
  const I = this;

  I.waitForElement('#attendHearing', 3);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.continue);
}

function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent) {
  const I = this;

  I.click(commonContent.continue);
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

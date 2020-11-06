function enterDoYouWantToAttendTheHearing(commonContent, option) {
  const I = this;

  I.wait(10);
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

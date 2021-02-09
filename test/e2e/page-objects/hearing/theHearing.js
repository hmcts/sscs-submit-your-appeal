function enterDoYouWantToAttendTheHearing(commonContent, option) {
  const I = this;

  I.wait(5);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.continue);
}

function enterDoYouWantToAttendTheHearingAfterSignIn(commonContent, option) {
  const I = this;

  I.wait(5);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.saveAndContinue);
}

function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent) {
  const I = this;

  I.click(commonContent.continue);
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  enterDoYouWantToAttendTheHearingAfterSignIn,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

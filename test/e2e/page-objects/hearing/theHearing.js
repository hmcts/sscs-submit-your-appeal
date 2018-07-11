function enterDoYouWantToAttendTheHearing(option) {
  const I = this;

  I.waitForElement('#attendHearing');
  I.checkOption(option);
  I.click('Continue');
}

function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue() {
  const I = this;

  I.click('Continue');
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

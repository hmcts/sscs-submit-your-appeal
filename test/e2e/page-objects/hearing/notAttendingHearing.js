function continueFromnotAttendingHearing(commonContent) {
  const I = this;

  I.wait(5);
  I.click(commonContent.continue);
}

function continueFromnotAttendingHearingAfterSignIn(commonContent) {
  const I = this;

  I.wait(5);
  I.click(commonContent.saveAndContinue);
}

module.exports = { continueFromnotAttendingHearing, continueFromnotAttendingHearingAfterSignIn };

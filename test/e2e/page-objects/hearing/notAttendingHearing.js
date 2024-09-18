function continueFromnotAttendingHearing(commonContent) {
  

  await page.waitForTimeout(5);
  await page.click(commonContent.continue);
}

function continueFromnotAttendingHearingAfterSignIn(commonContent) {
  

  await page.waitForTimeout(5);
  await page.click(commonContent.saveAndContinue);
}

module.exports = { continueFromnotAttendingHearing, continueFromnotAttendingHearingAfterSignIn };

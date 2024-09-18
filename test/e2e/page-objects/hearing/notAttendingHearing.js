async function continueFromnotAttendingHearing(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.click(commonContent.continue);
}

async function continueFromnotAttendingHearingAfterSignIn(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.click(commonContent.saveAndContinue);
}

module.exports = { continueFromnotAttendingHearing, continueFromnotAttendingHearingAfterSignIn };

async function continueFromnotAttendingHearing(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.getByText(commonContent.continue).first().click();
}

async function continueFromnotAttendingHearingAfterSignIn(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { continueFromnotAttendingHearing, continueFromnotAttendingHearingAfterSignIn };

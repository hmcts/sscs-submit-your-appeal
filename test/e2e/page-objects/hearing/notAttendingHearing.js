async function continueFromnotAttendingHearing(I, commonContent) {
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function continueFromnotAttendingHearingAfterSignIn(I, commonContent) {
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}

module.exports = { continueFromnotAttendingHearing, continueFromnotAttendingHearingAfterSignIn };

async function enterReasonsForBeingLateAndContinue(I, commonContent, reason) {
  await I.locator('#reasonForBeingLate').fill(reason);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { enterReasonsForBeingLateAndContinue };

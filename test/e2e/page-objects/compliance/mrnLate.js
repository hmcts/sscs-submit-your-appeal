async function enterReasonsForBeingLateAndContinue(page, commonContent, reason) {
  await page.fill('#reasonForBeingLate', reason);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { enterReasonsForBeingLateAndContinue };

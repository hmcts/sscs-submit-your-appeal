function enterReasonsForBeingLateAndContinue(commonContent, reason) {
  

  await page.fill('#reasonForBeingLate', reason);
  await page.click(commonContent.continue);
}

module.exports = { enterReasonsForBeingLateAndContinue };

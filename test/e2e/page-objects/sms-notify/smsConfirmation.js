function readSMSConfirmationAndContinue(commonContent) {
  
  await page.waitForTimeout(5);
  await page.click(commonContent.continue);
}

module.exports = { readSMSConfirmationAndContinue };

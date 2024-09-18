async function readSMSConfirmationAndContinue(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.click(commonContent.continue);
}

module.exports = { readSMSConfirmationAndContinue };

async function readSMSConfirmationAndContinue(page, commonContent) {
  await page.waitForTimeout(5000);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { readSMSConfirmationAndContinue };

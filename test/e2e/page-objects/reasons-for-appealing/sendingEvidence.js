async function readSendingEvidenceAndContinue(page, commonContent) {
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { readSendingEvidenceAndContinue };

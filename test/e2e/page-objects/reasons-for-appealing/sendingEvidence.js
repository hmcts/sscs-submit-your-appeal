function readSendingEvidenceAndContinue(page, commonContent) {
  

  await page.click(commonContent.continue);
}

module.exports = { readSendingEvidenceAndContinue };

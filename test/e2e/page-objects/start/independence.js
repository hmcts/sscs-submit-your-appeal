async function continueFromIndependance(page, commonContent) {
  await page.waitForTimeout(3000);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { continueFromIndependance };

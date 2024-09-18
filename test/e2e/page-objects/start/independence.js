async function continueFromIndependance(page, commonContent) {
  await page.waitForTimeout(3000);
  await page.click(commonContent.continue);
}

module.exports = { continueFromIndependance };

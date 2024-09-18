async function continueFromIndependance(page, commonContent) {
  await page.waitForTimeout(3);
  await page.click(commonContent.continue);
}

module.exports = { continueFromIndependance };

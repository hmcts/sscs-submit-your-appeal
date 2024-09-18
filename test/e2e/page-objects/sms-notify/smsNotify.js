async function selectUseSameNumberAndContinue(page, commonContent, option) {
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

module.exports = { selectUseSameNumberAndContinue };

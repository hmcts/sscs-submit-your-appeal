function selectUseSameNumberAndContinue(commonContent, option) {
  

  await page.locator(option).check()
  await page.click(commonContent.continue);
}

module.exports = { selectUseSameNumberAndContinue };

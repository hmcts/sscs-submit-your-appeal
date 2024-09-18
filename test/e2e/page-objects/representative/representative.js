function selectDoYouHaveARepresentativeAndContinue(page, commonContent, option) {
  

  await page.waitForTimeout(5);
  await page.locator(option).check()
  await page.click(commonContent.continue);
}

module.exports = { selectDoYouHaveARepresentativeAndContinue };

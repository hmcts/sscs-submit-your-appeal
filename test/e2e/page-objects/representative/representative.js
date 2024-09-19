async function selectDoYouHaveARepresentativeAndContinue(page, commonContent, option) {
  await page.waitForTimeout(5000);
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { selectDoYouHaveARepresentativeAndContinue };

async function enterMobileAndContinue(page, commonContent, mobileNumber) {
  await page.fill('enterMobile', mobileNumber);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { enterMobileAndContinue };

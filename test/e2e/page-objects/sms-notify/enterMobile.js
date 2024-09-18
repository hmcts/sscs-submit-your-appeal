async function enterMobileAndContinue(page, commonContent, mobileNumber) {
  await page.fill('enterMobile', mobileNumber);
  await page.click(commonContent.continue);
}

module.exports = { enterMobileAndContinue };

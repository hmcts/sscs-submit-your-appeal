function enterMobileAndContinue(commonContent, mobileNumber) {
  

  await page.fill('enterMobile', mobileNumber);
  await page.click(commonContent.continue);
}

module.exports = { enterMobileAndContinue };

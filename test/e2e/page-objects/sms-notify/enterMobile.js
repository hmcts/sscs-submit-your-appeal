async function enterMobileAndContinue(I, commonContent, mobileNumber) {
  await I.locator('enterMobile').fill(mobileNumber);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { enterMobileAndContinue };

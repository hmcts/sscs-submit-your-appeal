async function checkOptionAndContinue(page, commonContent, option) {
  await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

async function checkOptionAndContinueAfterSignIn(page, commonContent, option) {
  await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

async function checkPCQOptionAndContinue(page, option) {
  await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.getByText('Continue').first().click();
}

async function checkCYPCQOptionAndContinue(page, option) {
  await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.getByText('Parhau').first().click();
}

module.exports = {
  checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue
};

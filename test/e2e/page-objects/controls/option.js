async function checkOptionAndContinue(page, commonContent, option) {
  await await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

async function checkOptionAndContinueAfterSignIn(page, commonContent, option) {
  await await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.click(commonContent.saveAndContinue);
}

async function checkPCQOptionAndContinue(page, option) {
  await await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.click('Continue');
}

async function checkCYPCQOptionAndContinue(page, option) {
  await await page.waitForTimeout(10000);
  await page.locator(option).first().check();
  await page.click('Parhau');
}

module.exports = {
  checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue
};

async function checkOptionAndContinue(page, commonContent, option) {
  await page.waitForTimeout(10);
  await page.locator(option).check();
  page.waitForClickable(commonContent.continue, 3);
  await page.click(commonContent.continue);
}

async function checkOptionAndContinueAfterSignIn(page, commonContent, option) {
  await page.waitForTimeout(10);
  await page.locator(option).check();
  page.waitForClickable(commonContent.saveAndContinue, 3);
  await page.click(commonContent.saveAndContinue);
}

async function checkPCQOptionAndContinue(page, option) {
  await page.waitForTimeout(10);
  await page.locator(option).check();
  page.waitForClickable('Continue', 3);
  await page.click('Continue');
}

async function checkCYPCQOptionAndContinue(page, option) {
  await page.waitForTimeout(10);
  await page.locator(option).check();
  page.waitForClickable('Parhau', 3);
  await page.click('Parhau');
}

module.exports = {
  checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue
};

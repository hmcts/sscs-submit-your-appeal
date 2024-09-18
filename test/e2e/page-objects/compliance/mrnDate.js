async function enterAnMRNDateAndContinue(page, commonContent, date) {
  await page.waitForTimeout(1000);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  await page.click(commonContent.continue);
}

async function enterAnMRNDateAndContinueAfterSignIn(page, commonContent, date) {
  await page.waitForTimeout(1000);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  await page.click(commonContent.saveAndContinue);
}

module.exports = { enterAnMRNDateAndContinue, enterAnMRNDateAndContinueAfterSignIn };

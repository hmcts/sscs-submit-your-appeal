async function enterAnMRNDateAndContinue(page, commonContent, date) {
  await page.waitForTimeout(1000);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  await page.getByText(commonContent.continue).first().click();
}

async function enterAnMRNDateAndContinueAfterSignIn(page, commonContent, date) {
  await page.waitForTimeout(1000);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { enterAnMRNDateAndContinue, enterAnMRNDateAndContinueAfterSignIn };

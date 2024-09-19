async function enterADateAndContinue(page, commonContent, day, month, year) {
  await page.fill('input[name*="day"]', day);
  await page.fill('input[name*="month"]', month);
  await page.fill('input[name*="year"]', year);
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { enterADateAndContinue };

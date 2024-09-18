function enterADateAndContinue(commonContent, day, month, year) {
  

  await page.fill('input[name*="day"]', day);
  await page.fill('input[name*="month"]', month);
  await page.fill('input[name*="year"]', year);
  await page.click(commonContent.continue);
}

module.exports = { enterADateAndContinue };

async function enterADateAndContinue(I, commonContent, day, month, year) {
  await I.locator('input[name*="day"]').first().fill(day);
  await I.locator('input[name*="month"]').first().fill(month);
  await I.locator('input[name*="year"]').first().fill(year);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { enterADateAndContinue };

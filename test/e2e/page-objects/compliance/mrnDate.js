const { expect } = require('@playwright/test');

async function enterAnMRNDateAndContinue(I, commonContent, date) {
  await I.locator('input[name*="day"]').fill(date.date().toString());
  await I.locator('input[name*="month"]').fill((date.month() + 1).toString());
  await I.locator('input[name*="year"]').fill(date.year().toString());
  await expect(I.getByText(commonContent.continue).first()).toBeEnabled();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterAnMRNDateAndContinueAfterSignIn(I, commonContent, date) {
  await I.locator('input[name*="day"]').fill(date.date().toString());
  await I.locator('input[name*="month"]').fill((date.month() + 1).toString());
  await I.locator('input[name*="year"]').fill(date.year().toString());
  await expect(I.getByText(commonContent.continue).first()).toBeEnabled();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  enterAnMRNDateAndContinue,
  enterAnMRNDateAndContinueAfterSignIn
};

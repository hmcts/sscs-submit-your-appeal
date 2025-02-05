const { expect } = require('@playwright/test');

async function checkOptionAndContinue(I, commonContent, option) {
  await I.locator(option).first().check();
  await expect(I.getByText(commonContent.continue).first()).toBeEnabled();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function checkOptionAndContinueAfterSignIn(I, commonContent, option) {
  await I.locator(option).first().check();
  await expect(
    I.getByText(commonContent.saveAndContinue).first()
  ).toBeEnabled();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function checkPCQOptionAndContinue(I, option) {
  await I.locator(option).first().check();
  await expect(
    I.getByRole('button', { name: 'Continue' }).first()
  ).toBeEnabled();
  await I.getByRole('button', { name: 'Continue' }).first().click();
}

async function checkCYPCQOptionAndContinue(I, option) {
  await I.locator(option).first().check();
  await expect(I.getByText('Parhau').first()).toBeEnabled();
  await I.getByText('Parhau').first().click();
}

module.exports = {
  checkOptionAndContinue,
  checkOptionAndContinueAfterSignIn,
  checkPCQOptionAndContinue,
  checkCYPCQOptionAndContinue
};

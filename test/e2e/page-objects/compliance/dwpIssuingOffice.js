const { expect } = require('@playwright/test');

async function enterDWPIssuingOfficeAndContinue(I, commonContent, id) {
  await I.locator('#pipNumber').first().selectOption(id);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterDWPIssuingOfficeAndContinueAfterSignIn(I, commonContent, id) {
  await I.locator('#pipNumber').selectOption(id);
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}


async function enterDWPIssuingOffice(I, commonContent, id) {
  await I.locator('#dwpIssuingOffice').selectOption(id);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function seeDWPIssuingOfficeError(I, url, error) {
  await I.waitForURL(`**/${url}`);
  await expect(I.getByText(error).first()).toBeVisible();
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError
};

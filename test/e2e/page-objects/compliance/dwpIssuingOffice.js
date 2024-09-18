const { expect } = require('@playwright/test');

async function enterDWPIssuingOfficeAndContinue(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#pipNumber', id);
  await page.click(commonContent.continue);
}

async function enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#pipNumber', id);
  await page.click(commonContent.saveAndContinue);
}

async function enterDWPIssuingOffice(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#dwpIssuingOffice', id);
  await page.click(commonContent.continue);
}

async function seeDWPIssuingOfficeError(page, url, error) {
  await page.waitForURL(`**/${url}`);
  await expect(page.getByText(error)).toBeVisible();
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError
};

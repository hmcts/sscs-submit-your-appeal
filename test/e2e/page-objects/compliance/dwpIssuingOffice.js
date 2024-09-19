/* eslint-disable no-useless-escape */
const { expect } = require('@playwright/test');

async function enterDWPIssuingOfficeAndContinue(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#pipNumber', id);
  await page.getByText(commonContent.continue).first().click();
}

async function enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#pipNumber', id);
  await page.getByText(commonContent.saveAndContinue).first().click();
}

async function enterDWPIssuingOffice(page, commonContent, id) {
  await page.waitForTimeout(3000);
  await page.selectOption('#dwpIssuingOffice', id);
  await page.getByText(commonContent.continue).first().click();
}

async function seeDWPIssuingOfficeError(page, url, error) {
  await page.waitForURL(`**\/${url}`);
  await expect(page.getByText(error).first()).toBeVisible();
}

module.exports = {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn,
  enterDWPIssuingOffice,
  seeDWPIssuingOfficeError
};

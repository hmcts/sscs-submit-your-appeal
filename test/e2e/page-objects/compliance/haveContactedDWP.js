const dwpContactContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const dwpContactContentCy = require('steps/compliance/have-contacted-dwp/content.cy');
const { expect } = require('@playwright/test');

async function selectHaveYouContactedDWPAndContinue(page, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

async function selectHaveYouContactedDWPAndContinueAfterSignIn(page, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

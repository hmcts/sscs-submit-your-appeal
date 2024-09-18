const dwpContactContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const dwpContactContentCy = require('steps/compliance/have-contacted-dwp/content.cy');
const { expect } = require('@playwright/test');

async function selectHaveYouContactedDWPAndContinue(page, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

async function selectHaveYouContactedDWPAndContinueAfterSignIn(page, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

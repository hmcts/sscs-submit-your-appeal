const haveMRNContentEn = require('../../../../steps/compliance/have-a-mrn/content.en');
const haveMRNContentCy = require('../../../../steps/compliance/have-a-mrn/content.cy');
const { expect } = require('@playwright/test');

async function selectHaveYouGotAMRNAndContinue(page, language, commonContent, option) {
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  await expect(page.getByText(haveMRNContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

async function selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, option) {
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  await expect(page.getByText(haveMRNContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { selectHaveYouGotAMRNAndContinue, selectHaveYouGotAMRNAndContinueAfterSignIn };

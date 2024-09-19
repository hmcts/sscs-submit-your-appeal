const postCodeContentEn = require('steps/start/postcode-checker/content.en');
const postCodeContentCy = require('steps/start/postcode-checker/content.cy');
const { expect } = require('@playwright/test');

async function enterPostcodeAndContinue(page, language, commonContent, postcode) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(page.getByText(postCodeContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#postcode', postcode);
  await page.getByText(commonContent.continue).first().click();
  await page.waitForTimeout(1000);
}

async function enterPostcodeAndContinueAfterSignIn(page, language, commonContent, postcode) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(page.getByText(postCodeContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#postcode', postcode);
  await page.getByText(commonContent.saveAndContinue).first().click();
  await page.waitForTimeout(1000);
}

module.exports = { enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn };

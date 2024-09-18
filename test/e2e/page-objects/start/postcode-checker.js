const postCodeContentEn = require('steps/start/postcode-checker/content.en');
const postCodeContentCy = require('steps/start/postcode-checker/content.cy');
const { expect } = require('@playwright/test');

async function enterPostcodeAndContinue(page, language, commonContent, postcode) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(page.getByText(postCodeContent.title)).toBeVisible({ timeout: 45000 });
  await page.fill({ id: 'postcode' }, postcode);
  await page.click(commonContent.continue);
  await page.waitForTimeout(1000);
}

async function enterPostcodeAndContinueAfterSignIn(page, language, commonContent, postcode) {
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  await expect(page.getByText(postCodeContent.title)).toBeVisible({ timeout: 45000 });
  await page.fill({ id: 'postcode' }, postcode);
  await page.click(commonContent.saveAndContinue);
  await page.waitForTimeout(1000);
}

module.exports = { enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn };

const noMRNContentEn = require('steps/compliance/no-mrn/content.en');
const noMRNContentCy = require('steps/compliance/no-mrn/content.cy');
const { expect } = require('@playwright/test');

async function enterReasonForNoMRNAndContinue(page, language, commonContent, reason) {
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(page.getByText(noMRNContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#reasonForNoMRN', reason);
  await page.getByText(commonContent.continue).first().click();
}

async function enterReasonForNoMRNAndContinueAfterSignIn(page, language, commonContent, reason) {
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(page.getByText(noMRNContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#reasonForNoMRN', reason);
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { enterReasonForNoMRNAndContinue, enterReasonForNoMRNAndContinueAfterSignIn };

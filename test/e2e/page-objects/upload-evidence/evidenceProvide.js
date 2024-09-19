const evidenceUploadContentEn = require('../../../../steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceUploadContentCy = require('../../../../steps/reasons-for-appealing/evidence-provide/content.cy');
const { expect } = require('@playwright/test');

async function selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, option) {
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(page.getByText(evidenceUploadContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

async function selectAreYouProvidingEvidenceAfterSignIn(page, language, commonContent, option) {
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(page.getByText(evidenceUploadContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { selectAreYouProvidingEvidenceAndContinue, selectAreYouProvidingEvidenceAfterSignIn };

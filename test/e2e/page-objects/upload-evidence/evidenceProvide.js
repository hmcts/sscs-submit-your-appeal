const evidenceUploadContentEn = require('steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceUploadContentCy = require('steps/reasons-for-appealing/evidence-provide/content.cy');

function selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, option) {
  
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(page.getByText(evidenceUploadContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  scrollPageToBottom(page, );
  await page.click(commonContent.continue);
}

function selectAreYouProvidingEvidenceAfterSignIn(language, commonContent, option) {
  
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(page.getByText(evidenceUploadContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  scrollPageToBottom(page, );
  await page.click(commonContent.saveAndContinue);
}

module.exports = { selectAreYouProvidingEvidenceAndContinue, selectAreYouProvidingEvidenceAfterSignIn };

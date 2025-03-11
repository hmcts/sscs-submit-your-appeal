const evidenceUploadContentEn = require('steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceUploadContentCy = require('steps/reasons-for-appealing/evidence-provide/content.cy');
const { expect } = require('@playwright/test');

async function selectAreYouProvidingEvidenceAndContinue(
  I,
  language,
  commonContent,
  option
) {
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(I.getByText(evidenceUploadContent.title).first()).toBeVisible();
  await I.locator(option).check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function selectAreYouProvidingEvidenceAfterSignIn(
  I,
  language,
  commonContent,
  option
) {
  const evidenceUploadContent = language === 'en' ? evidenceUploadContentEn : evidenceUploadContentCy;

  await expect(I.getByText(evidenceUploadContent.title).first()).toBeVisible();
  await I.locator(option).check();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  selectAreYouProvidingEvidenceAndContinue,
  selectAreYouProvidingEvidenceAfterSignIn
};

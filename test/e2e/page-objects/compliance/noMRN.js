const noMRNContentEn = require('steps/compliance/no-mrn/content.en');
const noMRNContentCy = require('steps/compliance/no-mrn/content.cy');
const { expect } = require('@playwright/test');

async function enterReasonForNoMRNAndContinue(
  I,
  language,
  commonContent,
  reason
) {
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(I.getByText(noMRNContent.title).first()).toBeVisible();
  await I.locator('#reasonForNoMRN').first().fill(reason);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterReasonForNoMRNAndContinueAfterSignIn(
  I,
  language,
  commonContent,
  reason
) {
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(I.getByText(noMRNContent.title).first()).toBeVisible();
  await I.locator('#reasonForNoMRN').first().fill(reason);
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

module.exports = {
  enterReasonForNoMRNAndContinue,
  enterReasonForNoMRNAndContinueAfterSignIn
};

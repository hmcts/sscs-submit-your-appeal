const noMRNContentEn = require('steps/compliance/no-mrn/content.en');
const noMRNContentCy = require('steps/compliance/no-mrn/content.cy');

function enterReasonForNoMRNAndContinue(language, commonContent, reason) {
  
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(page.getByText(noMRNContent.title)).toBeVisible({ timeout: 45000 })
  await page.fill('#reasonForNoMRN', reason);
  await page.click(commonContent.continue);
}

function enterReasonForNoMRNAndContinueAfterSignIn(language, commonContent, reason) {
  
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  await expect(page.getByText(noMRNContent.title)).toBeVisible({ timeout: 45000 })
  await page.fill('#reasonForNoMRN', reason);
  await page.click(commonContent.saveAndContinue);
}

module.exports = { enterReasonForNoMRNAndContinue, enterReasonForNoMRNAndContinueAfterSignIn };

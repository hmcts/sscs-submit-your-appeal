const dwpContactContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const dwpContactContentCy = require('steps/compliance/have-contacted-dwp/content.cy');

function selectHaveYouContactedDWPAndContinue(language, commonContent, option) {
  
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  await page.click(commonContent.continue);
}

function selectHaveYouContactedDWPAndContinueAfterSignIn(language, commonContent, option) {
  
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(page.getByText(dwpContactContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  await page.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

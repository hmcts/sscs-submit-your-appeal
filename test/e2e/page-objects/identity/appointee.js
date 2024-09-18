const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');
const { expect } = require('@playwright/test');

async function selectAreYouAnAppointeeAndContinue(page, language, commonContent, option) {
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  await expect(page.getByText(appointeeContent.fields.isAppointee.yes)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

async function selectAreYouAnAppointeeAndContinueAfterSignIn(page, language, commonContent, option) {
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  await expect(page.getByText(appointeeContent.fields.isAppointee.yes)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.saveAndContinue);
}

module.exports = { selectAreYouAnAppointeeAndContinue, selectAreYouAnAppointeeAndContinueAfterSignIn };

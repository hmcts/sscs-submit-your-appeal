const createAccountContentEn = require('../../../../steps/start/create-account/content.en');
const createAccountContentCy = require('../../../../steps/start/create-account/content.cy');
const { expect } = require('@playwright/test');

async function selectIfYouWantToCreateAccount(page, language, commonContent, option) {
  const createAccountContent = language === 'en' ? createAccountContentEn : createAccountContentCy;

  await expect(page.getByText(createAccountContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { selectIfYouWantToCreateAccount };

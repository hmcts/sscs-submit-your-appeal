const createAccountContentEn = require('steps/start/create-account/content.en');
const createAccountContentCy = require('steps/start/create-account/content.cy');
const { expect } = require('@playwright/test');

async function selectIfYouWantToCreateAccount(page, language, commonContent, option) {
  const createAccountContent = language === 'en' ? createAccountContentEn : createAccountContentCy;

  await expect(page.getByText(createAccountContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

module.exports = { selectIfYouWantToCreateAccount };

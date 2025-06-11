const createAccountContentEn = require('steps/start/create-account/content.en');
const createAccountContentCy = require('steps/start/create-account/content.cy');
const { expect } = require('@playwright/test');

async function selectIfYouWantToCreateAccount(
  I,
  language,
  commonContent,
  option
) {
  const createAccountContent = language === 'en' ? createAccountContentEn : createAccountContentCy;

  await expect(I.getByText(createAccountContent.title).first()).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectIfYouWantToCreateAccount };

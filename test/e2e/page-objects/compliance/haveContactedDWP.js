const dwpContactContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const dwpContactContentCy = require('steps/compliance/have-contacted-dwp/content.cy');
const { expect } = require('@playwright/test');

async function selectHaveYouContactedDWPAndContinue(I, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(I.getByText(dwpContactContent.title).first()).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function selectHaveYouContactedDWPAndContinueAfterSignIn(I, language, commonContent, option) {
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  await expect(I.getByText(dwpContactContent.title).first()).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

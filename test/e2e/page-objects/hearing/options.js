const telHearingContentEn = require('steps/hearing/options/content.en');
const telHearingContentCy = require('steps/hearing/options/content.cy');
const { expect } = require('@playwright/test');

async function selectTelephoneHearingOptionsAndContinue(I, language, commonContent) {
  const telHearingContent = language === 'en' ? telHearingContentEn : telHearingContentCy;

  await expect(I.getByText(telHearingContent.title).first()).toBeVisible();
  await expect(I.locator('#selectOptions').first()).toBeVisible();
  await I.locator('//input[@id=\'selectOptions.telephone.requested-true\']').first().check();
  await I.locator('//input[@id=\'selectOptions.telephone.phoneNumber\']').first().fill('07534345634');
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

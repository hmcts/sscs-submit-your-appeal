const benefitContentEn = require('steps/start/benefit-type/content.en');
const benefitContentCy = require('steps/start/benefit-type/content.cy');
const { expect } = require('@playwright/test');

async function enterBenefitTypeAndContinue(I, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await expect(I.getByText(benefitContent.title).first()).toBeVisible();
  await I.locator('#benefitType').first().pressSequentially(type);
  await I.locator('#benefitType__option--0').first().click();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterBenefitTypeAfterSignIn(I, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await expect(I.getByText(benefitContent.title).first()).toBeVisible();
  await I.locator('#benefitType').first().pressSequentially(type);
  await I.locator('#benefitType__option--0').first().click();
  await I.getByRole('button', { name: commonContent.saveAndContinue }).first().click();
}

module.exports = { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn };

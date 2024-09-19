const benefitContentEn = require('../../../../steps/start/benefit-type/content.en');
const benefitContentCy = require('../../../../steps/start/benefit-type/content.cy');
const { expect } = require('@playwright/test');

async function enterBenefitTypeAndContinue(page, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await expect(page.getByText(benefitContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#benefitType', type.split(' ')[0]);
  await page.getByText(type).first().click();
  await page.getByText(commonContent.continue).first().click();
}

async function enterBenefitTypeAfterSignIn(page, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await expect(page.getByText(benefitContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.fill('#benefitType', type);
  await page.click('#benefitType__option--0');
  await page.getByText(commonContent.saveAndContinue).first().click();
}

module.exports = { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn };

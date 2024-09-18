const benefitContentEn = require('steps/start/benefit-type/content.en');
const benefitContentCy = require('steps/start/benefit-type/content.cy');

async function enterBenefitTypeAndContinue(page, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await await expect(page.getByText(benefitContent.title, 5)).toBeVisible({ timeout: 45000 });
  await await page.fill({ id: 'benefitType' }, type);
  await page.click('#benefitType__option--0');
  await page.click(commonContent.continue);
}

async function enterBenefitTypeAfterSignIn(page, language, commonContent, type) {
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  await await expect(page.getByText(benefitContent.title, 5)).toBeVisible({ timeout: 45000 });
  await await page.fill({ id: 'benefitType' }, type);
  await page.click('#benefitType__option--0');
  await page.click(commonContent.saveAndContinue);
}

module.exports = { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn };

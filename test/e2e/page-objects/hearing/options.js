const telHearingContentEn = require('../../../../steps/hearing/options/content.en');
const telHearingContentCy = require('../../../../steps/hearing/options/content.cy');
const { expect } = require('@playwright/test');

async function selectTelephoneHearingOptionsAndContinue(page, language, commonContent) {
  const telHearingContent = language === 'en' ? telHearingContentEn : telHearingContentCy;

  await expect(page.getByText(telHearingContent.title).first()).toBeVisible({ timeout: 45000 });
  // await page.locator('#selectOptions').first().waitFor({ timeout: 5000 })
  await page.locator("//input[@id='selectOptions.telephone.requested-true']").first().check();
  await page.fill("//input[@id='selectOptions.telephone.phoneNumber']", '07534345634');
  await page.getByText(commonContent.continue).first().click();
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

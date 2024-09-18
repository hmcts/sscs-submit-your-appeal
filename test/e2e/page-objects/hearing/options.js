const telHearingContentEn = require('steps/hearing/options/content.en');
const telHearingContentCy = require('steps/hearing/options/content.cy');

function selectTelephoneHearingOptionsAndContinue(page, language, commonContent) {
  
  const telHearingContent = language === 'en' ? telHearingContentEn : telHearingContentCy;

  await expect(page.getByText(telHearingContent.title)).toBeVisible({ timeout: 45000 })
  // page.waitForElement('#selectOptions', 5);
  await page.locator("//input[@id='selectOptions.telephone.requested-true']").check()
  await page.fill("//input[@id='selectOptions.telephone.phoneNumber']", '07534345634');
  await page.click(commonContent.continue);
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

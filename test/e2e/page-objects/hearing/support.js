const hearingSupportContentEn = require('steps/hearing/support/content.en');
const hearingSupportContentCy = require('steps/hearing/support/content.cy');

async function selectDoYouNeedSupportAndContinue(page, language, commonContent, option) {
  const hearingSupportContent = language === 'en' ? hearingSupportContentEn : hearingSupportContentCy;

  await expect(page.getByText(hearingSupportContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).check();
  await page.click(commonContent.continue);
}

module.exports = { selectDoYouNeedSupportAndContinue };

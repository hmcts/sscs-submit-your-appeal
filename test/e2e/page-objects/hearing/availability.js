const hearingAvailabilityContentEn = require('steps/hearing/availability/content.en');
const hearingAvailabilityContentCy = require('steps/hearing/availability/content.cy');

async function selectHearingAvailabilityAndContinue(page, language, commonContent, option) {
  const hearingAvailabilityContent = language === 'en' ? hearingAvailabilityContentEn : hearingAvailabilityContentCy;

  await expect(page.getByText(hearingAvailabilityContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).check();
  await page.click(commonContent.continue);
}

module.exports = { selectHearingAvailabilityAndContinue };

const hearingAvailabilityContentEn = require('steps/hearing/availability/content.en');
const hearingAvailabilityContentCy = require('steps/hearing/availability/content.cy');
const { expect } = require('@playwright/test');

async function selectHearingAvailabilityAndContinue(page, language, commonContent, option) {
  const hearingAvailabilityContent = language === 'en' ? hearingAvailabilityContentEn : hearingAvailabilityContentCy;

  await expect(page.getByText(hearingAvailabilityContent.title)).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.click(commonContent.continue);
}

module.exports = { selectHearingAvailabilityAndContinue };

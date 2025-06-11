const hearingAvailabilityContentEn = require('steps/hearing/availability/content.en');
const hearingAvailabilityContentCy = require('steps/hearing/availability/content.cy');
const { expect } = require('@playwright/test');

async function selectHearingAvailabilityAndContinue(
  I,
  language,
  commonContent,
  option
) {
  const hearingAvailabilityContent =
    language === 'en'
      ? hearingAvailabilityContentEn
      : hearingAvailabilityContentCy;

  await expect(
    I.getByText(hearingAvailabilityContent.title).first()
  ).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { selectHearingAvailabilityAndContinue };

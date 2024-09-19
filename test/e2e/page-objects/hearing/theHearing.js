const hearingAttendanceContentEn = require('../../../../steps/hearing/the-hearing/content.en');
const hearingAttendanceContentCy = require('../../../../steps/hearing/the-hearing/content.cy');
const { expect } = require('@playwright/test');

async function enterDoYouWantToAttendTheHearing(page, language, commonContent, option) {
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(page.getByText(hearingAttendanceContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.continue).first().click();
}

async function enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, option) {
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(page.getByText(hearingAttendanceContent.title).first()).toBeVisible({ timeout: 45000 });
  await page.locator(option).first().check();
  await page.getByText(commonContent.saveAndContinue).first().click();
}

async function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent) {
  await page.getByText(commonContent.continue).first().click();
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  enterDoYouWantToAttendTheHearingAfterSignIn,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

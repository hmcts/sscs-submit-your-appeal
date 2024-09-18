const hearingAttendanceContentEn = require('steps/hearing/the-hearing/content.en');
const hearingAttendanceContentCy = require('steps/hearing/the-hearing/content.cy');

function enterDoYouWantToAttendTheHearing(page, language, commonContent, option) {
  
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(page.getByText(hearingAttendanceContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  scrollPageToBottom(page, );
  await page.click(commonContent.continue);
}

function enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, option) {
  
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(page.getByText(hearingAttendanceContent.title)).toBeVisible({ timeout: 45000 })
  await page.locator(option).check()
  scrollPageToBottom(page, );
  await page.click(commonContent.saveAndContinue);
}

function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent) {
  

  await page.click(commonContent.continue);
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  enterDoYouWantToAttendTheHearingAfterSignIn,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue,
};

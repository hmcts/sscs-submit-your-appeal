const hearingAttendanceContentEn = require('steps/hearing/the-hearing/content.en');
const hearingAttendanceContentCy = require('steps/hearing/the-hearing/content.cy');
const { expect } = require('@playwright/test');

async function enterDoYouWantToAttendTheHearing(
  I,
  language,
  commonContent,
  option
) {
  const hearingAttendanceContent =
    language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(
    I.getByText(hearingAttendanceContent.title).first()
  ).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterDoYouWantToAttendTheHearingAfterSignIn(
  I,
  language,
  commonContent,
  option
) {
  const hearingAttendanceContent =
    language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  await expect(
    I.getByText(hearingAttendanceContent.title).first()
  ).toBeVisible();
  await I.locator(option).first().check();
  await I.getByRole('button', { name: commonContent.saveAndContinue })
    .first()
    .click();
}

async function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(
  I,
  commonContent
) {
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  enterDoYouWantToAttendTheHearingAfterSignIn,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

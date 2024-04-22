const hearingAttendanceContentEn = require('steps/hearing/the-hearing/content.en');
const hearingAttendanceContentCy = require('steps/hearing/the-hearing/content.cy');

function enterDoYouWantToAttendTheHearing(language, commonContent, option) {
  const I = this;
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  I.waitForText(hearingAttendanceContent.title);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.continue);
}

function enterDoYouWantToAttendTheHearingAfterSignIn(language, commonContent, option) {
  const I = this;
  const hearingAttendanceContent = language === 'en' ? hearingAttendanceContentEn : hearingAttendanceContentCy;

  I.waitForText(hearingAttendanceContent.title);
  I.checkOption(option);
  I.scrollPageToBottom();
  I.click(commonContent.saveAndContinue);
}

function readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent) {
  const I = this;

  I.click(commonContent.continue);
}

module.exports = {
  enterDoYouWantToAttendTheHearing,
  enterDoYouWantToAttendTheHearingAfterSignIn,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
};

const content = require('commonContent');

function e2eBenefit(I, benefitCode, office, signer, language, hasDwpIssuingOffice) {
  const commonContent = content[language];
  I.createTheSession(language);
  I.wait(2);
  I.enterCaseDetailsFromStartToNINO(commonContent, language, benefitCode, office, hasDwpIssuingOffice);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  if (language === 'en') {
    I.completeAllPcq();
  } else {
    I.completeAllPcqCY();
  }
  I.checkYourAppealToConfirmationPage(language, signer);
  I.endTheSession();
}


module.exports = {
  e2eBenefit
};
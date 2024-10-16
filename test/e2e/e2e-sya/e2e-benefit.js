const content = require('commonContent');

function e2eBenefit(I, benefitSearch, office, signer, language, hasDwpIssuingOffice) {
  const commonContent = content[language];
  I.createTheSession(language);
  I.wait(1);
  I.enterCaseDetailsFromStartToNINO(commonContent, language, benefitSearch, office, hasDwpIssuingOffice);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-no');
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

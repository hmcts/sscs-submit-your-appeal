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
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  I.checkYourAppealToConfirmationPage(language, signer);
  I.endTheSession();
}


module.exports = {
  e2eBenefit
};

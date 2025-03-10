const content = require('commonContent');
const { createTheSession } = require('../page-objects/session/createSession');
const { enterCaseDetailsFromStartToNINO, enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  checkYourAppealToConfirmationPage } = require('../page-objects/cya/checkYourAppeal');
const { enterAppellantContactDetailsWithMobileAndContinue } = require('../page-objects/identity/appellantDetails');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const { readSMSConfirmationAndContinue } = require('../page-objects/sms-notify/smsConfirmation');
const { enterDoYouWantToAttendTheHearing } = require('../page-objects/hearing/theHearing');
const { selectTelephoneHearingOptionsAndContinue } = require('../page-objects/hearing/options');
const { selectDoYouNeedSupportAndContinue } = require('../page-objects/hearing/support');
const { selectHearingAvailabilityAndContinue } = require('../page-objects/hearing/availability');
const { completeAllPcq, completeAllPcqCY } = require('../page-objects/pcq/pcq');
const { endTheSession } = require('../page-objects/session/endSession');

async function e2eBenefit(page, benefitSearch, office, signer, language, hasDwpIssuingOffice) {
  const commonContent = content[language];
  await createTheSession(page, language);
  await enterCaseDetailsFromStartToNINO(page, commonContent, language, benefitSearch, office, hasDwpIssuingOffice);
  await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07411222222');
  await checkOptionAndContinue(page, commonContent, '#doYouWantTextMsgReminders');
  await checkOptionAndContinue(page, commonContent, '#useSameNumber');
  await readSMSConfirmationAndContinue(page, commonContent);
  await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, commonContent, '#arrangements-2');
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-2');
  if (language === 'en') {
    await completeAllPcq(page);
  } else {
    await completeAllPcqCY(page);
  }
  await checkYourAppealToConfirmationPage(page, language, signer);
  await endTheSession(page);
}


module.exports = {
  e2eBenefit
};

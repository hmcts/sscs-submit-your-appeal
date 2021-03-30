/* eslint-disable no-process-env */

const language = 'cy';

const content = require('commonContent');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - CA E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - CA E2E SYA Journey @fullfunctional`, I => {
  const searchName = testData.benefitTypes[0].searchName;
  const commonContent = content[language];
  I.createTheSession(language);
  I.wait(2);
  I.enterDetailsFromStartToNINOWithSearchName(commonContent, language, searchName);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  I.completeAllPcqCY();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  I.endTheSession();
}).retry(1);

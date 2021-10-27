/* eslint-disable no-process-env */

const language = 'cy';

const content = require('commonContent');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - PIP E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - PIP E2E SYA Journey @functional @crossbrowser @e2e`, I => {
  const commonContent = content[language];

  I.createTheSession(language);

  I.wait(4);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  I.skipPcqCY();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(20);

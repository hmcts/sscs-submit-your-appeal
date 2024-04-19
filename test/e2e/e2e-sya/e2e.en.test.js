/* eslint-disable no-process-env */

const language = 'en';

const content = require('commonContent');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - PIP E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - PIP E2E SYA Journey @functional @e2e`, ({ I }) => {
  const commonContent = content[language];

  I.createTheSession(language);

  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-no');
  I.skipPcq();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  I.endTheSession();
}).retry(10);

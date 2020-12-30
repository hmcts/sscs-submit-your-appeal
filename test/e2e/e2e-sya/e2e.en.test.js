/* eslint-disable no-process-env */

const language = 'en';

const content = require('commonContent');
const testData = require(`test/e2e/data.${language}`);
const config = require('config');

const aatUrl = 'https://benefit-appeal.aat.platform.hmcts.net';
const actUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

Feature(`${language.toUpperCase()} - PIP E2E SYA - Full Journey`);

Scenario(`${language.toUpperCase()} - PIP E2E SYA Journey @functional`, I => {
  const commonContent = content[language];

  I.createTheSession(language);

  I.wait(2);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
  I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
  I.readSMSConfirmationAndContinue(commonContent);
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  if (actUrl === aatUrl) I.completePcq();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  I.endTheSession();
}).retry(1);

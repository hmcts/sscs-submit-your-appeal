/* eslint-disable no-process-env */


const content = require('commonContent');
const testData = require('test/e2e/data.en');

Feature('Crossbrowser - PIP E2E SYA - Full Journey');

Scenario('English - PIP E2E SYA Journey', ({ I }) => {
  const commonContent = content.en;
  const language = 'en';

  I.createTheSession(language);

  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.continueFromnotAttendingHearing(commonContent);
  I.skipPcq();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(8);


Scenario('Welsh - PIP E2E SYA Journey', ({ I }) => {
  const commonContent = content.cy;
  const language = 'cy';

  I.createTheSession(language);

  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.continueFromnotAttendingHearing(commonContent);
  I.skipPcqCY();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(8);

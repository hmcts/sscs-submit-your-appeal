/* eslint-disable no-process-env */


const content = require('commonContent');
const testData = require('test/e2e/data.en');

Feature('Crossbrowser - PIP E2E SYA - Full Journey');

Scenario('English - PIP E2E SYA Journey', I => {
  const commonContent = content.en;

  I.createTheSession('en');

  I.wait(2);
  I.enterDetailsFromStartToNINO(commonContent, 'en');
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-no');
  I.continueFromnotAttendingHearing(commonContent);
  I.skipPcq();
  I.checkYourAppealToConfirmationPage('en', testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(5);


Scenario('Welsh - PIP E2E SYA Journey', I => {
  const commonContent = content.cy;

  I.createTheSession('cy');

  I.wait(2);
  I.enterDetailsFromStartToNINO(commonContent, 'cy');
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-no');
  I.continueFromnotAttendingHearing(commonContent);
  I.skipPcqCY();
  I.checkYourAppealToConfirmationPage('cy', testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(5);

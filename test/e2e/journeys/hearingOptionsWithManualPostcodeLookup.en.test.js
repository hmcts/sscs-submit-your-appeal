/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - Hearing options test for type Telephone @functional`);

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant enters telephone hearing option`, I => {
  I.amOnPage(paths.session.root);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
  I.skipPcq();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(20);

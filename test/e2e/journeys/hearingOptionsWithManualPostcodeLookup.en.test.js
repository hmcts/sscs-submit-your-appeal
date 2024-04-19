/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);
// const config = require('config');

// const testConfig = config.get('e2e.retry');

Feature(`${language.toUpperCase()} - Hearing options test for type Telephone @functional`);

Before(({ I }) => {
  I.wait(1);
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant enters telephone hearing option`, ({ I }) => {
  I.amOnPage(paths.session.root);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.enterAppellantContactDetailsManuallyAndContinue(commonContent);
  I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, commonContent, '#arrangements-no');
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-no');
  I.skipPcq();
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);

  I.endTheSession();
}).retry(10);

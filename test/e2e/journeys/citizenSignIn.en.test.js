/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and create a new application @fullFunctional`, I => {
  moment().locale(language);
  I.enterDetailsForNewApplication(commonContent, language);
}).retry(1);

Scenario(`${language.toUpperCase()} - Sign in as a existing user and archive an application @fullFunctional`, I => {
  moment().locale(language);
  I.enterDetailsToArchiveACase(commonContent, language);
}).retry(1);

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional`, I => {
  moment().locale(language);

  I.enterDetailsFromStartToDraftAppeals(commonContent, language);
  I.enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(commonContent, language, '07411222222');
  I.checkOptionAndContinueAfterSignIn(commonContent, '#doYouWantTextMsgReminders-no');
  I.checkOptionAndContinueAfterSignIn(commonContent, '#hasRepresentative-no');
  I.addReasonForAppealingUsingTheOnePageFormAfterSignIn(commonContent, testData.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAfterSignIn(commonContent, testData.reasonsForAppealing.otherReasons);
  I.selectAreYouProvidingEvidenceAfterSignIn(commonContent, '#evidenceProvide-no');
  I.enterDoYouWantToAttendTheHearingAfterSignIn(commonContent, '#attendHearing-no');
  I.continueFromnotAttendingHearingAfterSignIn(commonContent);
  I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  I.appealSubmitConfirmation(language);
}).retry(1);
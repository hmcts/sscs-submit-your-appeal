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

Scenario(`${language.toUpperCase()} - Sign in as a new user and create a new application @fullFunctional`, async I => {
  await moment().locale(language);
  await I.enterDetailsForNewApplication(commonContent, language, process.env.USEREMAIL_1);
}).retry(5);

Scenario(`${language.toUpperCase()} - Sign in as a existing user and archive an application @fullFunctional`, I => {
  moment().locale(language);
  I.enterDetailsToArchiveACase(commonContent, process.env.USEREMAIL_1);
}).retry(5);

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional`, async I => {
  await moment().locale(language);
  await I.enterDetailsFromStartToDraftAppeals(commonContent, language, process.env.USEREMAIL_2);
  await I.enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(commonContent, language, '07411222222');
  await I.checkOptionAndContinueAfterSignIn(commonContent, '#doYouWantTextMsgReminders-no');
  await I.checkOptionAndContinueAfterSignIn(commonContent, '#hasRepresentative-no');
  await I.addReasonForAppealingUsingTheOnePageFormAfterSignIn(commonContent, testData.reasonsForAppealing.reasons[0]);
  await I.enterAnythingElseAfterSignIn(commonContent, testData.reasonsForAppealing.otherReasons);
  await I.selectAreYouProvidingEvidenceAfterSignIn(commonContent, '#evidenceProvide-no');
  await I.enterDoYouWantToAttendTheHearingAfterSignIn(commonContent, '#attendHearing-no');
  await I.continueFromnotAttendingHearingAfterSignIn(commonContent);
  await I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  await I.appealSubmitConfirmation(language);
}).retry(10);

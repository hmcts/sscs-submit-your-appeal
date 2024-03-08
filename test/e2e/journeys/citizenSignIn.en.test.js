/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);
const testUser = require('../../util/IdamUser');

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);


Before(({ I }) => {
  I.createTheSession(language);
  userEmail = testUser.createUser();
});

After(({ I }) => {
  I.endTheSession();
  testUser.deleteUser(userEmail);
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional`, async({ I }) => {
  await moment().locale(language);
  await I.enterDetailsFromStartToDraftAppeals(commonContent, language, userEmail);
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

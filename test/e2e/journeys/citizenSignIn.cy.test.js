/* eslint init-declarations: ["error", "never"]*/
const language = 'cy';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);
const testUser = require('../../util/IdamUser');

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);

let userEmail;

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
  userEmail = testUser.createUser();
});

After(I => {
  I.endTheSession();
  testUser.deleteUser(userEmail);
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @fullFunctional`, async I => {
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
}).retry(5);

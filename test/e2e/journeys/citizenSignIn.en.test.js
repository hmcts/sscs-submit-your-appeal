/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional`, async({ I }) => {
  await moment().locale(language);
  await I.enterDetailsFromStartToDraftAppeals(commonContent, language, process.env.USEREMAIL_1);
  await I.wait(5);
  await I.waitForElement('.form-buttons-group [href="/new-appeal"]', 30);
  await I.enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(commonContent, language, '07411222222');
  await I.checkOptionAndContinueAfterSignIn(commonContent, '#doYouWantTextMsgReminders-no');
  await I.checkOptionAndContinueAfterSignIn(commonContent, '#hasRepresentative-no');
  await I.addReasonForAppealingUsingTheOnePageFormAfterSignIn(language, commonContent, testData.reasonsForAppealing.reasons[0]);
  await I.enterAnythingElseAfterSignIn(language, commonContent, testData.reasonsForAppealing.otherReasons);
  await I.selectAreYouProvidingEvidenceAfterSignIn(language, commonContent, '#evidenceProvide-no');
  await I.enterDoYouWantToAttendTheHearingAfterSignIn(language, commonContent, '#attendHearing-no');
  await I.continueFromnotAttendingHearingAfterSignIn(commonContent);
  await I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
  await I.appealSubmitConfirmation(language);
}).retry(10);

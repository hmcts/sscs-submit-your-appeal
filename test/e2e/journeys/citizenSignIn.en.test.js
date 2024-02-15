/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);
const cookieContent = require('../page/cookieBanner/cookie-content');

Feature(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`);


Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional @oneFunctional`, async({ I }) => {
  await moment().locale(language);
    I.wait(1);
      I.click(cookieContent.rejectCookie);
      I.see(cookieContent.hideAfterReject);
      I.see(cookieContent.hideMessage);
      I.refreshPage();
      I.wait(2);
  await I.enterDetailsFromStartToDraftAppeals(commonContent, language, process.env.USEREMAIL_1);
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

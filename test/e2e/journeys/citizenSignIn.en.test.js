/* eslint-disable no-process-env */

const language = 'en';
const commonContent = require('../../../commonContent')[language];
const moment = require('moment');
const testData = require(`../data.${language}`);

const { test } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { enterDetailsFromStartToDraftAppeals, checkYourAppealToConfirmationPage } = require('../page-objects/cya/checkYourAppeal');
const { enterAppellantContactDetailsWithMobileAndContinueAfterSignIn } = require('../page-objects/identity/appellantDetails');
const { checkOptionAndContinueAfterSignIn } = require('../page-objects/controls/option');
const { addReasonForAppealingUsingTheOnePageFormAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');
const { enterAnythingElseAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonsForAppealing');
const { selectAreYouProvidingEvidenceAfterSignIn } = require('../page-objects/upload-evidence/evidenceProvide');
const { enterDoYouWantToAttendTheHearingAfterSignIn } = require('../page-objects/hearing/theHearing');
const { continueFromnotAttendingHearingAfterSignIn } = require('../page-objects/hearing/notAttendingHearing');
const { appealSubmitConfirmation } = require('../page-objects/cya/appealSubmitConfirmation');

test.describe(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page @functional`, async({ page }) => {
    await moment().locale(language);
    await enterDetailsFromStartToDraftAppeals(page, page, commonContent, language, process.env.USEREMAIL_1);
    await enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(page, commonContent, language, '07411222222');
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#doYouWantTextMsgReminders-no');
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#hasRepresentative-no');
    await addReasonForAppealingUsingTheOnePageFormAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.reasons[0]);
    await enterAnythingElseAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    await selectAreYouProvidingEvidenceAfterSignIn(page, language, commonContent, '#evidenceProvide-no');
    await enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, '#attendHearing-no');
    await continueFromnotAttendingHearingAfterSignIn(page, commonContent);
    await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);
    await appealSubmitConfirmation(page, language);
  });
});

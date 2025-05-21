const { test } = require('@playwright/test');

const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);
const { appealSubmitConfirmation } = require('../page-objects/cya/appealSubmitConfirmation');
const {
  checkYourAppealToConfirmationPage,
  enterDetailsFromStartToDraftAppeals
} = require('../page-objects/cya/checkYourAppeal');
const { continueFromnotAttendingHearingAfterSignIn } = require('../page-objects/hearing/notAttendingHearing');
const { enterDoYouWantToAttendTheHearingAfterSignIn } = require('../page-objects/hearing/theHearing');
const { selectAreYouProvidingEvidenceAfterSignIn } = require('../page-objects/upload-evidence/evidenceProvide');
const { enterAnythingElseAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonsForAppealing');
const { addReasonForAppealingUsingTheOnePageFormAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');
const {
  checkOptionAndContinueAfterSignIn
} = require('../page-objects/controls/option');
const { enterAppellantContactDetailsWithMobileAndContinueAfterSignIn } = require('../page-objects/identity/appellantDetails');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');
const testUser = require('../../util/IdamUser');

let userEmail = '';

test.describe(`${language.toUpperCase()} - Citizen, Sign in scenarios for SYA`, () => {
  test.beforeEach('Create session and user', async ({ page }) => {
    await createTheSession(page, language);
    userEmail = await testUser.createUser();
  });

  test.afterEach('End session and delete user', async ({ page }) => {
    await endTheSession(page);
    await testUser.deleteUser(userEmail);
  });

  test(`${language.toUpperCase()} - Sign in as a new user and verify draft appeals page`, { tag: '@functional' }, async ({ page }) => {
    await moment().locale(language);
    await enterDetailsFromStartToDraftAppeals(page, commonContent, language, userEmail);
    await enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(page, commonContent, language, '07411222222');
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#doYouWantTextMsgReminders-2');
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#hasRepresentative-2');
    await addReasonForAppealingUsingTheOnePageFormAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.reasons[0]);
    await enterAnythingElseAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    await selectAreYouProvidingEvidenceAfterSignIn(page, language, commonContent, '#evidenceProvide-2');
    await enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, '#attendHearing-2');
    await continueFromnotAttendingHearingAfterSignIn(page, commonContent);
    await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);
    await appealSubmitConfirmation(page, language);
  });
});

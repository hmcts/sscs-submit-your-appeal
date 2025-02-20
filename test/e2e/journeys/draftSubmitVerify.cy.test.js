/* eslint-disable no-await-in-loop */
const { test } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);
const testUser = require('../../util/IdamUser');
const assert = require('assert');
const { appealSubmitConfirmation } = require('../page-objects/cya/appealSubmitConfirmation');
const {
  checkYourAppealToConfirmationPage,
  continueIncompleteAppeal,
  enterDetailsFromStartToDraft
} = require('../page-objects/cya/checkYourAppeal');
const { continueFromnotAttendingHearingAfterSignIn } = require('../page-objects/hearing/notAttendingHearing');
const { enterDoYouWantToAttendTheHearingAfterSignIn } = require('../page-objects/hearing/theHearing');
const { selectAreYouProvidingEvidenceAfterSignIn } = require('../page-objects/upload-evidence/evidenceProvide');
const { enterAnythingElseAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonsForAppealing');
const { addReasonForAppealingUsingTheOnePageFormAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');
const {
  checkOptionAndContinueAfterSignIn
} = require('../page-objects/controls/option');
const {
  enterAppellantContactDetailsWithMobileAndContinueAfterSignIn,
  enterAppellantNINOAndContinueAfterSignIn,
  enterAppellantDOBAndContinueAfterSignIn,
  enterAppellantNameAndContinueAfterSignIn
} = require('../page-objects/identity/appellantDetails');
const { selectAreYouAnAppointeeAndContinueAfterSignIn } = require('../page-objects/identity/appointee');
const { continueFromStillCanAppeal } = require('../page-objects/compliance/stillCanAppeal');
const { enterReasonForNoMRNAndContinueAfterSignIn } = require('../page-objects/compliance/noMRN');
const { selectHaveYouContactedDWPAndContinueAfterSignIn } = require('../page-objects/compliance/haveContactedDWP');
const { selectHaveYouGotAMRNAndContinueAfterSignIn } = require('../page-objects/compliance/haveAMRN');
const { continueFromIndependance } = require('../page-objects/start/independence');
const { navigateToDrafts, editDraftAppeal } = require('../page-objects/draft-appeals/draft-appeals-page');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');
const { getCaseData } = require('../page-objects/tribunals-case-api/getCaseData');

const appellant = testData.appellant;
let userEmail = '';

test.describe(`${language.toUpperCase()} - Verifying data when drafts are submitted to CCD`, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
    userEmail = testUser.createUser();
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
    testUser.deleteUser(userEmail);
  });

  test(`${language.toUpperCase()} - Sign in and submit draft appeal and verify the submitted CCD  `, { tag: '@fullFunctional' },
    async({ page, request, browser }) => {
      await moment().locale(language);
      await enterDetailsFromStartToDraft(page, commonContent, language, userEmail);
      await navigateToDrafts(page, language);
      const ccdCaseID = await editDraftAppeal(page, language);
      await continueIncompleteAppeal(page, language);
      await continueFromIndependance(page, commonContent);
      await selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-2');
      await selectHaveYouContactedDWPAndContinueAfterSignIn(page, language, commonContent, '#haveContactedDWP');
      await enterReasonForNoMRNAndContinueAfterSignIn(page, language, commonContent, testData.mrn.reasonForNoMRN);
      await continueFromStillCanAppeal(page, language);
      await selectAreYouAnAppointeeAndContinueAfterSignIn(page, language, commonContent, '#isAppointee');
      await enterAppellantNameAndContinueAfterSignIn(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
      await enterAppellantDOBAndContinueAfterSignIn(page, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
      await enterAppellantNINOAndContinueAfterSignIn(page, language, commonContent, appellant.nino);
      await enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(page, commonContent, language);
      await checkOptionAndContinueAfterSignIn(page, commonContent, '#doYouWantTextMsgReminders-2');
      await checkOptionAndContinueAfterSignIn(page, commonContent, '#hasRepresentative-2');
      await addReasonForAppealingUsingTheOnePageFormAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.reasons[0]);
      await enterAnythingElseAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
      await selectAreYouProvidingEvidenceAfterSignIn(page, language, commonContent, '#evidenceProvide-2');
      await enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, '#attendHearing-2');
      await continueFromnotAttendingHearingAfterSignIn(page, commonContent);
      await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);
      await appealSubmitConfirmation(page, language);
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
      let ccdCaseData = await getCaseData(browser, request, ccdCaseID);
      for (let count = 0; count < 5; count++) {
        ccdCaseData = await getCaseData(browser, request, ccdCaseID);
        if (ccdCaseData.length > 0) {
          break;
        }
        await delay(1000); // wait for 1 second before retrying
      }
      assert.equal(ccdCaseData[0].appeal_details.state, 'incompleteApplication');
    });
});

const language = 'cy';
const commonContent = require('../../../commonContent')[language];
const moment = require('moment');
const testData = require(`../data.${language}`);
const testUser = require('../../util/IdamUser');
const assert = require('assert');

const appellant = testData.appellant;
let userEmail = '';

const { test } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { enterDetailsFromStartToDraft, checkYourAppealToConfirmationPage, continueIncompleteAppeal } = require('../page-objects/cya/checkYourAppeal');
const { getCaseData } = require('../page-objects/tribunals-case-api/getCaseData');
const { appealSubmitConfirmation } = require('../page-objects/cya/appealSubmitConfirmation');
const { continueFromnotAttendingHearingAfterSignIn } = require('../page-objects/hearing/notAttendingHearing');
const { enterDoYouWantToAttendTheHearingAfterSignIn } = require('../page-objects/hearing/theHearing');
const { selectAreYouProvidingEvidenceAfterSignIn } = require('../page-objects/upload-evidence/evidenceProvide');
const { enterAnythingElseAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonsForAppealing');
const { addReasonForAppealingUsingTheOnePageFormAfterSignIn } = require('../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');
const { checkOptionAndContinueAfterSignIn } = require('../page-objects/controls/option');
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
const { editDraftAppeal, navigateToDrafts } = require('../page-objects/draft-appeals/draft-appeals-page');

test.describe(`${language.toUpperCase()} - Verifying data when drafts are submitted to CCD`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    userEmail = testUser.createUser();
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
    testUser.deleteUser(userEmail);
  });

  test(`${language.toUpperCase()} - Sign in and submit draft appeal and verify the submitted CCD @fullFunctional`, async({ page }) => {
    await moment().locale(language);
    await enterDetailsFromStartToDraft(page, commonContent, language, userEmail);
    await navigateToDrafts(page, language);
    const ccdCaseID = await editDraftAppeal(page, language);
    await continueIncompleteAppeal(page, language);
    await continueFromIndependance(page, commonContent);
    await selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-no');
    await selectHaveYouContactedDWPAndContinueAfterSignIn(page, language, commonContent, '#haveContactedDWP-yes');
    await enterReasonForNoMRNAndContinueAfterSignIn(page, language, commonContent, testData.mrn.reasonForNoMRN);
    await continueFromStillCanAppeal(page, language);
    await selectAreYouAnAppointeeAndContinueAfterSignIn(page, language, commonContent, '#isAppointee-no');
    await enterAppellantNameAndContinueAfterSignIn(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
    await enterAppellantDOBAndContinueAfterSignIn(page, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    await enterAppellantNINOAndContinueAfterSignIn(page, language, commonContent, appellant.nino);
    await enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(page, commonContent, language);
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#doYouWantTextMsgReminders-no');
    await checkOptionAndContinueAfterSignIn(page, commonContent, '#hasRepresentative-no');
    await addReasonForAppealingUsingTheOnePageFormAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.reasons[0]);
    await enterAnythingElseAfterSignIn(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    await selectAreYouProvidingEvidenceAfterSignIn(page, language, commonContent, '#evidenceProvide-no');
    await enterDoYouWantToAttendTheHearingAfterSignIn(page, language, commonContent, '#attendHearing-no');
    await continueFromnotAttendingHearingAfterSignIn(page, commonContent);
    await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);
    await appealSubmitConfirmation(page, language);
    const ccdCaseData = await getCaseData(page, page, ccdCaseID);
    assert.equal(ccdCaseData[0].appeal_details.state, 'incompleteApplication');
  });
});

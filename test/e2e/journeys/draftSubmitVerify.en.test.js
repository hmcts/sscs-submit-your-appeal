const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const testData = require(`test/e2e/data.${language}`);
const testUser = require('../../util/IdamUser');
const assert = require('assert');
// const config = require('config');

// const testConfig = config.get('e2e.retry');

const appellant = testData.appellant;
let userEmail = '';

Feature(`${language.toUpperCase()} - Verifying data when drafts are submitted to CCD`);

Before(({ I }) => {
  I.createTheSession(language);
  userEmail = testUser.createUser();
});

After(({ I }) => {
  I.endTheSession();
  testUser.deleteUser(userEmail);
});

Scenario(`${language.toUpperCase()} - Sign in and submit draft appeal and verify the submitted CCD  @fullFunctional`,
  async({ I }) => {
    await moment().locale(language);
    await I.enterDetailsFromStartToDraft(commonContent, language, userEmail);
    I.navigateToDrafts(language);
    const ccdCaseID = await I.editDraftAppeal(language);
    I.continueIncompleteAppeal(language);
    I.continueFromIndependance(commonContent);
    I.selectHaveYouGotAMRNAndContinueAfterSignIn(language, commonContent, '#haveAMRN-no');
    I.selectHaveYouContactedDWPAndContinueAfterSignIn(language, commonContent, '#haveContactedDWP-yes');
    I.enterReasonForNoMRNAndContinueAfterSignIn(language, commonContent, testData.mrn.reasonForNoMRN);
    I.continueFromStillCanAppeal(language);
    I.selectAreYouAnAppointeeAndContinueAfterSignIn(language, commonContent, '#isAppointee-no');
    I.enterAppellantNameAndContinueAfterSignIn(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinueAfterSignIn(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinueAfterSignIn(language, commonContent, appellant.nino);
    I.enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(commonContent, language);
    I.checkOptionAndContinueAfterSignIn(commonContent, '#doYouWantTextMsgReminders-no');
    I.checkOptionAndContinueAfterSignIn(commonContent, '#hasRepresentative-no');
    I.addReasonForAppealingUsingTheOnePageFormAfterSignIn(language, commonContent, testData.reasonsForAppealing.reasons[0]);
    I.enterAnythingElseAfterSignIn(language, commonContent, testData.reasonsForAppealing.otherReasons);
    I.selectAreYouProvidingEvidenceAfterSignIn(language, commonContent, '#evidenceProvide-no');
    I.enterDoYouWantToAttendTheHearingAfterSignIn(language, commonContent, '#attendHearing-no');
    I.continueFromnotAttendingHearingAfterSignIn(commonContent);
    I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
    I.appealSubmitConfirmation(language);
    const ccdCaseData = await I.getCaseData(I, ccdCaseID);
    assert.equal(ccdCaseData[0].appeal_details.state, 'incompleteApplication');
  }).retry(10);

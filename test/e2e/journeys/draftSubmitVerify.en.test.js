const language = 'en';
const commonContent = require('commonContent')[language];
const moment = require('moment');
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);
const testUser = require('../../util/IdamUser');
const assert = require('assert');

const appellant = testData.appellant;
let userEmail = '';

Feature(`${language.toUpperCase()} - Verifying data when drafts are submitted to CCD`);

Before(({ I }) => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
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
    I.selectHaveYouGotAMRNAndContinueAfterSignIn(commonContent, '#haveAMRN-no');
    I.selectHaveYouContactedDWPAndContinueAfterSignIn(commonContent, '#haveContactedDWP-yes');
    I.enterReasonForNoMRNAndContinueAfterSignIn(commonContent, testData.mrn.reasonForNoMRN);
    I.continueFromStillCanAppeal(language);
    I.selectAreYouAnAppointeeAndContinueAfterSignIn(commonContent, '#isAppointee-no');
    I.enterAppellantNameAndContinueAfterSignIn(commonContent, appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinueAfterSignIn(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinueAfterSignIn(commonContent, appellant.nino);
    I.enterAppellantContactDetailsWithMobileAndContinueAfterSignIn(commonContent, language);
    I.checkOptionAndContinueAfterSignIn(commonContent, '#doYouWantTextMsgReminders-no');
    I.checkOptionAndContinueAfterSignIn(commonContent, '#hasRepresentative-no');
    I.addReasonForAppealingUsingTheOnePageFormAfterSignIn(commonContent, testData.reasonsForAppealing.reasons[0]);
    I.enterAnythingElseAfterSignIn(commonContent, testData.reasonsForAppealing.otherReasons);
    I.selectAreYouProvidingEvidenceAfterSignIn(commonContent, '#evidenceProvide-no');
    I.enterDoYouWantToAttendTheHearingAfterSignIn(commonContent, '#attendHearing-no');
    I.continueFromnotAttendingHearingAfterSignIn(commonContent);
    I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
    I.appealSubmitConfirmation(language);
    const ccdCaseData = await I.getCaseData(I, ccdCaseID);
    assert.equal(ccdCaseData[0].appeal_details.state, 'incompleteApplication');
  }).retry(10);

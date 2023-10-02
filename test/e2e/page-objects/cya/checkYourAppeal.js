/* eslint-disable no-process-env */

const DateUtils = require('utils/DateUtils');
const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const supportContentEn = require('steps/hearing/support/content.en');
const supportContentCy = require('steps/hearing/support/content.cy');
const datesCantAttendContentEn = require('steps/hearing/dates-cant-attend/content.en');
const datesCantAttendContentCy = require('steps/hearing/dates-cant-attend/content.cy');
const config = require('config');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');
const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled') === 'true';

const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');
const testDataEn = require('test/e2e/data.en');
const testDataCy = require('test/e2e/data.cy');

const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

const appellant = testDataEn.appellant;
// const oneMonthAgo = DateUtils.oneMonthAgo();

function enterDetailsFromStartToNINO(commonContent, language, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  //  if (actUrl === aatUrl) I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneMonthAgo(language));
  I.enterDWPIssuingOfficeAndContinue(commonContent, testDataEn.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinue(commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
}

function enterCaseDetailsFromStartToNINO(commonContent, language, benefitTypeCode, office, hasDwpIssuingOffice) {
  const I = this;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  // if (actUrl === aatUrl) I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.getRandomDateInLast30Days(language));
  if (hasDwpIssuingOffice) {
    I.enterDWPIssuingOffice(commonContent, office);
  }
  I.selectAreYouAnAppointeeAndContinue(commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
}


function enterDetailsFromStartToDraftAppeals(commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  /* Create new application */
  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-yes');
  I.signIn(newUserEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(commonContent, benefitTypeCode);
  I.signOut(language);

  /* Login to submit saved case */
  I.createTheSession(language);
  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-yes');
  I.signIn(newUserEmail, testDataEn.signIn.password, language);
  I.verifyDraftAppealsAndEditACase(language);
  I.chooseLanguagePreferenceAfterSignIn(commonContent, 'no');
  I.continueFromIndependance(commonContent);
  I.selectHaveYouGotAMRNAndContinueAfterSignIn(commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinueAfterSignIn(commonContent, DateUtils.oneMonthAgo(language));
  I.enterDWPIssuingOfficeAndContinueAfterSignIn(commonContent, testDataEn.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinueAfterSignIn(commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinueAfterSignIn(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinueAfterSignIn(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinueAfterSignIn(commonContent, appellant.nino);
}

async function enterDetailsFromStartToDraft(commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-yes');
  await I.signInVerifylanguage(newUserEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(commonContent, benefitTypeCode);
  I.chooseLanguagePreferenceAfterSignIn(commonContent, 'no');
  I.enterPostcodeAndContinueAfterSignIn(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
}

function enterDetailsForNewApplication(commonContent, language, userEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-yes');
  I.signIn(userEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(commonContent, benefitTypeCode);
  I.chooseLanguagePreferenceAfterSignIn(commonContent, 'no');
  I.enterPostcodeAndContinueAfterSignIn(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectHaveYouGotAMRNAndContinueAfterSignIn(commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinueAfterSignIn(commonContent, DateUtils.oneMonthAgo(language));
  I.enterDWPIssuingOfficeAndContinueAfterSignIn(commonContent, testDataEn.mrn.dwpIssuingOffice);
}

function enterDetailsToArchiveACase(commonContent, language, userEmail) {
  const I = this;

  I.amOnPage(`${baseUrl}/sign-out`);
  I.navigateToSignInLink();
  I.signIn(userEmail, testDataEn.signIn.password, language);
  I.verifyDraftAppealsAndArchiveACase(language);
}

function enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent) {
  const I = this;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(commonContent, testDataEn.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(commonContent, '#evidenceProvide-yes');
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
}

function enterDetailsFromNoRepresentativeToEnd(commonContent) {
  const I = this;

  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent);
  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-no');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
}

async function enterDetailsFromAttendingTheHearingToEnd(commonContent, language, date) {
  const I = this;
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-yes');
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-yes');
  await I.turnOffJsAndReloadThePage();
  I.enterDateCantAttendAndContinue(commonContent, date, datesCantAttendContent.links.add);
  I.forceClick(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, date) {
  const I = this;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(supportContent.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.wait(1);
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-yes');
  I.wait(1);
  await I.selectDates(language, [date]);
  I.click(commonContent.continue);
}

function enterDetailsFromAttendingTheHearingWithSupportToEnd(commonContent, language, options, fields = []) {
  const I = this;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(commonContent);
  I.selectDoYouNeedSupportAndContinue(supportContent.fields.arrangements.yes);
  options.forEach(option => {
    I.click(option);
  });
  fields.forEach(field => {
    I.fillField(field.id, field.content);
  });
  I.click(commonContent.continue);
  I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
}

function enterDetailsFromNoRepresentativeToNoUploadingEvidence(commonContent) {
  const I = this;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(commonContent, testDataEn.reasonsForAppealing.otherReasons);
  // I.readSendingEvidenceAndContinue(commonContent);
  I.selectAreYouProvidingEvidenceAndContinue(commonContent, '#evidenceProvide-no');
}

function confirmDetailsArePresent(language, hasMRN = true, mrnDate) {
  const testData = language === 'en' ? testDataEn : testDataCy;
  const I = this;
  const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  const oneMonthAgo = DateUtils.oneMonthAgo(language);
  let mrnDateToCheck = mrnDate;

  if (hasMRN && !mrnDate) {
    mrnDateToCheck = oneMonthAgo;
  }

  // We are on CYA
  I.seeCurrentUrlEquals(paths.checkYourAppeal);

  // Type of benefit
  I.see(testData.benefitType.description);

  if (hasMRN) {
    // MRN address number
    I.see(testData.mrn.dwpIssuingOffice, selectors[language].mrn.dwpIssuingOffice);

    // The Date of the MRN
    I.see(DateUtils.formatDate(mrnDateToCheck, 'DD MMMM YYYY'));

    if (mrnDateToCheck.isAfter(oneMonthAgo)) {
      // Reason why the MRN is late
      I.see(testData.mrn.reasonWhyMRNisLate);
    }
  } else {
    // Reason for no MRN
    I.see(testData.mrn.reasonForNoMRN, selectors[language].mrn.noMRN);
  }

  // Appellant name
  I.see(`${appellant.title}. ${appellant.firstName} ${appellant.lastName}`);

  // Appellant DOB
  if (language === 'en') {
    I.see('25 January 1980');
  } else {
    I.see('25 Ionawr 1980');
  }

  // Appellant NINO
  I.see(appellant.nino);

  // Appellant address
  I.see(appellant.contactDetails.addressLine1);
  I.see(appellant.contactDetails.addressLine2);
  I.see(appellant.contactDetails.townCity);
  I.see(appellant.contactDetails.county);
  I.see(appellant.contactDetails.postCode);

  // Appellant Reason for appealing
  I.see(testData.reasonsForAppealing.reasons[0].whatYouDisagreeWith);
  I.see(testData.reasonsForAppealing.reasons[0].reasonForAppealing);

  // Anything else the appellant wants to tell the tribunal
  I.see(testData.reasonsForAppealing.otherReasons);

  // Shows when the appeal is complete
  I.see(checkYourAppealContent.header);
}

function checkYourAppealToConfirmationPage(language, signer) {
  const I = this;
  I.checkYourAppealToConfirmation(language, signer);
}

function continueIncompleteAppeal(language) {
  const I = this;
  I.seeCurrentUrlEquals(paths.checkYourAppeal);
  if (language === 'en') {
    I.see('Check your answers');
    I.see('Your application is incomplete');
    I.see('There are still some questions to answer.');
    I.click('Continue your application');
  } else {
    I.see('Gwiriwch eich atebion');
    I.see('Mae eich cais yn anghyflawn');
    I.see('Mae yna gwestiynau nad ydych wedi’u hateb.');
    I.click('Parhau á’ch cais');
  }
}

module.exports = {
  enterDetailsFromStartToNINO,
  enterCaseDetailsFromStartToNINO,
  enterDetailsFromStartToDraftAppeals,
  enterDetailsFromStartToDraft,
  enterDetailsForNewApplication,
  enterDetailsToArchiveACase,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromAttendingTheHearingToEnd,
  enterDetailsFromAttendingTheHearingDatePickerToEnd,
  enterDetailsFromNoRepresentativeToEnd,
  confirmDetailsArePresent,
  enterDetailsFromAttendingTheHearingWithSupportToEnd,
  checkYourAppealToConfirmationPage,
  enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  continueIncompleteAppeal
};

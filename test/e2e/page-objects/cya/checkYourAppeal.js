/* eslint-disable no-process-env */

const DateUtils = require('utils/DateUtils');
const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const supportContentEn = require('steps/hearing/support/content.en');
const supportContentCy = require('steps/hearing/support/content.cy');
const datesCantAttendContentEn = require('steps/hearing/dates-cant-attend/content.en');
const datesCantAttendContentCy = require('steps/hearing/dates-cant-attend/content.cy');
const config = require('config');
const testNIData = require('../../../util/randomData');

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

  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  //  if (actUrl === aatUrl) I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(language, commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneMonthAgo(language));
  I.enterDWPIssuingOfficeAndContinue(commonContent, testDataEn.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinue(language, commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinue(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(language, commonContent, testNIData.generateValidNINumber());
}

function enterCaseDetailsFromStartToNINO(commonContent, language, benefitTypeCode, office, hasDwpIssuingOffice) {
  const I = this;

  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  // if (actUrl === aatUrl) I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(language, commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.getRandomDateInLast30Days(language));
  if (hasDwpIssuingOffice) {
    I.enterDWPIssuingOffice(commonContent, office);
  }
  I.selectAreYouAnAppointeeAndContinue(language, commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinue(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(language, commonContent, testNIData.generateValidNINumber());
}


function enterDetailsFromStartToDraftAppeals(commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  /* Create new application */
  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-yes');
  I.signIn(newUserEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(language, commonContent, benefitTypeCode);
  I.signOut(language);

  /* Login to submit saved case */
  I.createTheSession(language);
  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-yes');
  I.signIn(newUserEmail, testDataEn.signIn.password, language);
  I.verifyDraftAppealsAndEditACase(language);
  I.chooseLanguagePreferenceAfterSignIn(language, commonContent, 'no');
  I.continueFromIndependance(commonContent);
  I.selectHaveYouGotAMRNAndContinueAfterSignIn(language, commonContent, '#haveAMRN-yes');
  I.enterAnMRNDateAndContinueAfterSignIn(commonContent, DateUtils.oneMonthAgo(language));
  I.enterDWPIssuingOfficeAndContinueAfterSignIn(commonContent, testDataEn.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinueAfterSignIn(language, commonContent, '#isAppointee-no');
  I.enterAppellantNameAndContinueAfterSignIn(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinueAfterSignIn(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinueAfterSignIn(language, commonContent, testNIData.generateValidNINumber());
}

async function enterDetailsFromStartToDraft(commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-yes');
  await I.signInVerifylanguage(newUserEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreferenceAfterSignIn(language, commonContent, 'no');
  I.enterPostcodeAndContinueAfterSignIn(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
}

function enterDetailsForNewApplication(commonContent, language, userEmail, benefitTypeCode = testDataEn.benefitType.code) {
  const I = this;

  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreference(language, commonContent, 'no');
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-yes');
  I.signIn(userEmail, testDataEn.signIn.password, language);
  I.createNewApplication(language);
  I.enterBenefitTypeAfterSignIn(language, commonContent, benefitTypeCode);
  I.chooseLanguagePreferenceAfterSignIn(language, commonContent, 'no');
  I.enterPostcodeAndContinueAfterSignIn(language, commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  I.selectHaveYouGotAMRNAndContinueAfterSignIn(language, commonContent, '#haveAMRN-yes');
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

function enterDetailsFromNoRepresentativeToUploadingEvidence(language, commonContent) {
  const I = this;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(language, commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(language, commonContent, '#evidenceProvide-yes');
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
}

function enterDetailsFromNoRepresentativeToEnd(language, commonContent) {
  const I = this;

  I.enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent);
  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-no');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
}

async function enterDetailsFromAttendingTheHearingToEnd(commonContent, language, date) {
  const I = this;
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, commonContent, '#arrangements-yes');
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-yes');
  await I.turnOffJsAndReloadThePage();
  I.amOnPage(paths.hearing.datesCantAttend);
  I.wait(2);
  I.enterDateCantAttendAndContinue(commonContent, date, datesCantAttendContent.links.add);
  I.wait(5);
  I.forceClick(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, date) {
  const I = this;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, supportContent.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.wait(1);
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-yes');
  I.wait(1);
  await I.selectDates(language, [date]);
  I.click(commonContent.continue);
}

function enterDetailsFromAttendingTheHearingWithSupportToEnd(commonContent, language, options, fields = []) {
  const I = this;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  I.enterDoYouWantToAttendTheHearing(language, commonContent, '#attendHearing-yes');
  I.selectTelephoneHearingOptionsAndContinue(language, commonContent);
  I.selectDoYouNeedSupportAndContinue(language, supportContent.fields.arrangements.yes);
  options.forEach(option => {
    I.click(option);
  });
  fields.forEach(field => {
    I.fillField(field.id, field.content);
  });
  I.click(commonContent.continue);
  I.selectHearingAvailabilityAndContinue(language, commonContent, '#scheduleHearing-no');
}

function enterDetailsFromNoRepresentativeToNoUploadingEvidence(language, commonContent) {
  const I = this;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, '#hasRepresentative-no');
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(language, commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  // I.readSendingEvidenceAndContinue(commonContent);
  I.selectAreYouProvidingEvidenceAndContinue(language, commonContent, '#evidenceProvide-no');
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
    I.waitForText('Check your answers');
    I.see('Your application is incomplete');
    I.see('There are still some questions to answer.');
    I.click('Continue your application');
  } else {
    I.waitForText('Gwiriwch eich atebion');
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

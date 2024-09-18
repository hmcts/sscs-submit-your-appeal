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
const {enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn} = require("../start/benefit-type");
const {chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn} = require("../start/language-preference");
const {enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn} = require("../start/postcode-checker");
const {continueFromIndependance} = require("../start/independence");
const {selectIfYouWantToCreateAccount} = require("../idam/createAccount");
const {selectHaveYouGotAMRNAndContinue, selectHaveYouGotAMRNAndContinueAfterSignIn} = require("../compliance/haveAMRN");
const {enterAnMRNDateAndContinue, enterAnMRNDateAndContinueAfterSignIn} = require("../compliance/mrnDate");
const {enterDWPIssuingOfficeAndContinue, enterDWPIssuingOffice, enterDWPIssuingOfficeAndContinueAfterSignIn} = require("../compliance/dwpIssuingOffice");
const {selectAreYouAnAppointeeAndContinue, selectAreYouAnAppointeeAndContinueAfterSignIn} = require("../identity/appointee");
const {enterAppellantNameAndContinue, enterAppellantDOBAndContinue, enterAppellantNINOAndContinue,
  enterAppellantNameAndContinueAfterSignIn, enterAppellantDOBAndContinueAfterSignIn,
  enterAppellantNINOAndContinueAfterSignIn
} = require("../identity/appellantDetails");
const {signIn, signInVerifylanguage, navigateToSignInLink} = require("../sign-in/sign-in-with-valid-creds");
const {createNewApplication} = require("../draft-appeals/create-new-application");
const {signOut} = require("../sign-out/sign-out");
const {createTheSession} = require("../session/createSession");
const {verifyDraftAppealsAndEditACase, verifyDraftAppealsAndArchiveACase} = require("../draft-appeals/draft-appeals-page");
const {selectDoYouHaveARepresentativeAndContinue} = require("../representative/representative");
const {addReasonForAppealingUsingTheOnePageFormAndContinue} = require("../reasons-for-appealing/reasonForAppealingOnePageForm");
const {enterAnythingElseAndContinue} = require("../reasons-for-appealing/reasonsForAppealing");
const {readSendingEvidenceAndContinue} = require("../reasons-for-appealing/sendingEvidence");
const {selectAreYouProvidingEvidenceAndContinue} = require("../upload-evidence/evidenceProvide");
const {uploadAPieceOfEvidence} = require("../upload-evidence/uploadEvidencePage");
const {enterDescription} = require("../upload-evidence/evidenceDescription");
const {enterDoYouWantToAttendTheHearing, readYouHaveChosenNotToAttendTheHearingNoticeAndContinue} = require("../hearing/theHearing");
const {selectTelephoneHearingOptionsAndContinue} = require("../hearing/options");
const {selectDoYouNeedSupportAndContinue} = require("../hearing/support");
const {checkAllArrangementsAndContinue} = require("../hearing/arrangements");
const {selectHearingAvailabilityAndContinue} = require("../hearing/availability");
const {enterDateCantAttendAndContinue, selectDates} = require("../hearing/datesCantAttend");
const {checkYourAppealToConfirmation} = require("./checkYourAnswers");

const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

const appellant = testDataEn.appellant;
// const oneMonthAgo = DateUtils.oneMonthAgo();

async function enterDetailsFromStartToNINO(page, commonContent, language, benefitTypeCode = testDataEn.benefitType.code) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  //  if (actUrl === aatUrl) await chooseLanguagePreference(page, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  if (allowSaveAndReturnEnabled) {
    await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-no');
  }
  await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-yes');
  await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.oneMonthAgo(language));
  enterDWPIssuingOfficeAndContinue(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
  selectAreYouAnAppointeeAndContinue(page, language, commonContent, '#isAppointee-no');
  enterAppellantNameAndContinue(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  enterAppellantDOBAndContinue(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year,
  );
  enterAppellantNINOAndContinue(page, language, commonContent, appellant.nino);
}

async function enterCaseDetailsFromStartToNINO(page, commonContent, language, benefitTypeCode, office, hasDwpIssuingOffice) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  // if (actUrl === aatUrl) await chooseLanguagePreference(page, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  if (allowSaveAndReturnEnabled) {
    await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-no');
  }
  await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-yes');
  await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.getRandomDateInLast30Days(language));
  if (hasDwpIssuingOffice) {
    enterDWPIssuingOffice(page, commonContent, office);
  }
  selectAreYouAnAppointeeAndContinue(page, language, commonContent, '#isAppointee-no');
  enterAppellantNameAndContinue(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  enterAppellantDOBAndContinue(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year,
  );
  enterAppellantNINOAndContinue(page, language, commonContent, appellant.nino);
}

async function enterDetailsFromStartToDraftAppeals(
  page,
  commonContent,
  language,
  newUserEmail,
  benefitTypeCode = testDataEn.benefitType.code,
) {
  /* Create new application */
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  signIn(page, newUserEmail, testDataEn.signIn.password, language);
  createNewApplication(page, language);
  await enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  signOut(page, language);

  /* Login to submit saved case */
  createTheSession(page, language);
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  signIn(page, newUserEmail, testDataEn.signIn.password, language);
  verifyDraftAppealsAndEditACase(page, language);
  chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  await continueFromIndependance(page, commonContent);
  selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-yes');
  enterAnMRNDateAndContinueAfterSignIn(page, commonContent, DateUtils.oneMonthAgo(language));
  enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
  selectAreYouAnAppointeeAndContinueAfterSignIn(page, language, commonContent, '#isAppointee-no');
  enterAppellantNameAndContinueAfterSignIn(
    page,
    language,
    commonContent,
    appellant.title,
    appellant.firstName,
    appellant.lastName,
  );
  enterAppellantDOBAndContinueAfterSignIn(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year,
  );
  enterAppellantNINOAndContinueAfterSignIn(page, language, commonContent, appellant.nino);
}

async function enterDetailsFromStartToDraft(
  page,
  commonContent,
  language,
  newUserEmail,
  benefitTypeCode = testDataEn.benefitType.code,
) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  await signInVerifylanguage(page, newUserEmail, testDataEn.signIn.password, language);
  createNewApplication(page, language);
  enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  enterPostcodeAndContinueAfterSignIn(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
}

async function enterDetailsForNewApplication(
  page,
  commonContent,
  language,
  userEmail,
  benefitTypeCode = testDataEn.benefitType.code,
) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  signIn(page, userEmail, testDataEn.signIn.password, language);
  createNewApplication(page, language);
  enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  enterPostcodeAndContinueAfterSignIn(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-yes');
  enterAnMRNDateAndContinueAfterSignIn(page, commonContent, DateUtils.oneMonthAgo(language));
  enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
}

async function enterDetailsToArchiveACase(page, commonContent, language, userEmail) {
  page.goto(`${baseUrl}/sign-out`);
  navigateToSignInLink(page);
  signIn(page, userEmail, testDataEn.signIn.password, language);
  verifyDraftAppealsAndArchiveACase(page, language);
}

async function enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent) {
  selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
  addReasonForAppealingUsingTheOnePageFormAndContinue(
    page,
    language,
    commonContent,
    testDataEn.reasonsForAppealing.reasons[0],
  );
  enterAnythingElseAndContinue(page, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    readSendingEvidenceAndContinue(page, commonContent);
  }
  if (evidenceUploadEnabled) {
    selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-yes');
    uploadAPieceOfEvidence(page);
    enterDescription(page, commonContent, 'Some description of the evidence');
  }
}

async function enterDetailsFromNoRepresentativeToEnd(page, language, commonContent) {
  await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-no');
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent);
}

async function enterDetailsFromAttendingTheHearingToEnd(page, commonContent, language, date) {
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, commonContent, '#arrangements-yes');
  checkAllArrangementsAndContinue(page, commonContent, language);
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-yes');
  page.goto(paths.hearing.datesCantAttend);
  await page.waitForTimeout(2);
  enterDateCantAttendAndContinue(page, commonContent, date, datesCantAttendContent.links.add);
  await page.waitForTimeout(5);
  await page.click(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, date) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, supportContent.fields.arrangements.yes);
  checkAllArrangementsAndContinue(page, commonContent, language);
  await page.waitForTimeout(1);
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-yes');
  await page.waitForTimeout(1);
  await selectDates(page, language, [date]);
  await page.click(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingWithSupportToEnd(page, commonContent, language, options, fields = []) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, supportContent.fields.arrangements.yes);
  for (const option of options) {
    await page.click(option);
  }
  fields.forEach((field) => {
    await page.fill(field.id, field.content);
  });
  await page.click(commonContent.continue);
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-no');
}

async function enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent) {
  selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
  addReasonForAppealingUsingTheOnePageFormAndContinue(
    page,
    language,
    commonContent,
    testDataEn.reasonsForAppealing.reasons[0],
  );
  enterAnythingElseAndContinue(page, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  // readSendingEvidenceAndContinue(page, commonContent);
  selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-no');
}

async function confirmDetailsArePresent(page, language, hasMRN = true, mrnDate) {
  const testData = language === 'en' ? testDataEn : testDataCy;
  const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  const oneMonthAgo = DateUtils.oneMonthAgo(language);
  let mrnDateToCheck = mrnDate;

  if (hasMRN && !mrnDate) {
    mrnDateToCheck = oneMonthAgo;
  }

  // We are on CYA
  page.seeCurrentUrlEquals(paths.checkYourAppeal);

  // Type of benefit
  await expect(page.getByText(testData.benefitType.description)).toBeVisible();

  if (hasMRN) {
    // MRN address number
    await expect(page.getByText(testData.mrn.dwpIssuingOffice, selectors[language].mrn.dwpIssuingOffice)).toBeVisible();

    // The Date of the MRN
    await expect(page.getByText(DateUtils.formatDate(mrnDateToCheck, 'DD MMMM YYYY'))).toBeVisible();

    if (mrnDateToCheck.isAfter(oneMonthAgo)) {
      // Reason why the MRN is late
      await expect(page.getByText(testData.mrn.reasonWhyMRNisLate)).toBeVisible();
    }
  } else {
    // Reason for no MRN
    await expect(page.getByText(testData.mrn.reasonForNoMRN, selectors[language].mrn.noMRN)).toBeVisible();
  }

  // Appellant name
  await expect(page.getByText(`${appellant.title}. ${appellant.firstName} ${appellant.lastName}`)).toBeVisible();

  // Appellant DOB
  if (language === 'en') {
    await expect(page.getByText('25 January 1980')).toBeVisible();
  } else {
    await expect(page.getByText('25 Ionawr 1980')).toBeVisible();
  }

  // Appellant NINO
  await expect(page.getByText(appellant.nino)).toBeVisible();

  // Appellant address
  await expect(page.getByText(appellant.contactDetails.addressLine1)).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.addressLine2)).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.townCity)).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.county)).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.postCode)).toBeVisible();

  // Appellant Reason for appealing
  await expect(page.getByText(testData.reasonsForAppealing.reasons[0].whatYouDisagreeWith)).toBeVisible();
  await expect(page.getByText(testData.reasonsForAppealing.reasons[0].reasonForAppealing)).toBeVisible();

  // Anything else the appellant wants to tell the tribunal
  await expect(page.getByText(testData.reasonsForAppealing.otherReasons)).toBeVisible();

  // Shows when the appeal is complete
  await expect(page.getByText(checkYourAppealContent.header)).toBeVisible();
}

async function checkYourAppealToConfirmationPage(page, language, signer) {
  checkYourAppealToConfirmation(page, language, signer);
}

async function continueIncompleteAppeal(page, language) {
  page.seeCurrentUrlEquals(paths.checkYourAppeal);
  if (language === 'en') {
    await expect(page.getByText('Check your answers')).toBeVisible({ timeout: 45000 })
    await expect(page.getByText('Your application is incomplete')).toBeVisible();
    await expect(page.getByText('There are still some questions to answer.')).toBeVisible();
    await page.click('Continue your application');
  } else {
    await expect(page.getByText('Gwiriwch eich atebion')).toBeVisible({ timeout: 45000 })
    await expect(page.getByText('Mae eich cais yn anghyflawn')).toBeVisible();
    await expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.')).toBeVisible();
    await page.click('Parhau á’ch cais');
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
  continueIncompleteAppeal,
};

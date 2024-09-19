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
const { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn } = require('../start/benefit-type');
const { chooseLanguagePreference, chooseLanguagePreferenceAfterSignIn } = require('../start/language-preference');
const { enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn } = require('../start/postcode-checker');
const { continueFromIndependance } = require('../start/independence');
const { selectIfYouWantToCreateAccount } = require('../idam/createAccount');
const { selectHaveYouGotAMRNAndContinue, selectHaveYouGotAMRNAndContinueAfterSignIn } = require('../compliance/haveAMRN');
const { enterAnMRNDateAndContinue, enterAnMRNDateAndContinueAfterSignIn } = require('../compliance/mrnDate');
const { enterDWPIssuingOfficeAndContinue, enterDWPIssuingOffice, enterDWPIssuingOfficeAndContinueAfterSignIn } = require('../compliance/dwpIssuingOffice');
const { selectAreYouAnAppointeeAndContinue, selectAreYouAnAppointeeAndContinueAfterSignIn } = require('../identity/appointee');
const { enterAppellantNameAndContinue, enterAppellantDOBAndContinue, enterAppellantNINOAndContinue,
  enterAppellantNameAndContinueAfterSignIn, enterAppellantDOBAndContinueAfterSignIn,
  enterAppellantNINOAndContinueAfterSignIn } = require('../identity/appellantDetails');
const { signIn, signInVerifylanguage, navigateToSignInLink } = require('../sign-in/sign-in-with-valid-creds');
const { createNewApplication } = require('../draft-appeals/create-new-application');
const { signOut } = require('../sign-out/sign-out');
const { createTheSession } = require('../session/createSession');
const { verifyDraftAppealsAndEditACase, verifyDraftAppealsAndArchiveACase } = require('../draft-appeals/draft-appeals-page');
const { selectDoYouHaveARepresentativeAndContinue } = require('../representative/representative');
const { addReasonForAppealingUsingTheOnePageFormAndContinue } = require('../reasons-for-appealing/reasonForAppealingOnePageForm');
const { enterAnythingElseAndContinue } = require('../reasons-for-appealing/reasonsForAppealing');
const { readSendingEvidenceAndContinue } = require('../reasons-for-appealing/sendingEvidence');
const { selectAreYouProvidingEvidenceAndContinue } = require('../upload-evidence/evidenceProvide');
const { uploadAPieceOfEvidence } = require('../upload-evidence/uploadEvidencePage');
const { enterDescription } = require('../upload-evidence/evidenceDescription');
const { enterDoYouWantToAttendTheHearing, readYouHaveChosenNotToAttendTheHearingNoticeAndContinue } = require('../hearing/theHearing');
const { selectTelephoneHearingOptionsAndContinue } = require('../hearing/options');
const { selectDoYouNeedSupportAndContinue } = require('../hearing/support');
const { checkAllArrangementsAndContinue } = require('../hearing/arrangements');
const { selectHearingAvailabilityAndContinue } = require('../hearing/availability');
const { enterDateCantAttendAndContinue, selectDates } = require('../hearing/datesCantAttend');
const { checkYourAppealToConfirmation } = require('./checkYourAnswers');
const { expect } = require('@playwright/test');

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
  await enterAnMRNDateAndContinue(page, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinue(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
  await selectAreYouAnAppointeeAndContinue(page, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinue(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  await enterAppellantDOBAndContinue(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year
  );
  await enterAppellantNINOAndContinue(page, language, commonContent, appellant.nino);
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
  await enterAnMRNDateAndContinue(page, commonContent, DateUtils.getRandomDateInLast30Days(language));
  if (hasDwpIssuingOffice) {
    await enterDWPIssuingOffice(page, commonContent, office);
  }
  await selectAreYouAnAppointeeAndContinue(page, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinue(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  await enterAppellantDOBAndContinue(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year
  );
  await enterAppellantNINOAndContinue(page, language, commonContent, appellant.nino);
}

async function enterDetailsFromStartToDraftAppeals(
  page,
  commonContent,
  language,
  newUserEmail,
  benefitTypeCode = testDataEn.benefitType.code
) {
  /* Create new application */
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  await signIn(page, newUserEmail, testDataEn.signIn.password, language);
  await createNewApplication(page, language);
  await enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  await signOut(page, language);

  /* Login to submit saved case */
  await createTheSession(page, language);
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  await signIn(page, newUserEmail, testDataEn.signIn.password, language);
  await verifyDraftAppealsAndEditACase(page, language);
  await chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  await continueFromIndependance(page, commonContent);
  await selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-yes');
  await enterAnMRNDateAndContinueAfterSignIn(page, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
  await selectAreYouAnAppointeeAndContinueAfterSignIn(page, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinueAfterSignIn(
    page,
    language,
    commonContent,
    appellant.title,
    appellant.firstName,
    appellant.lastName
  );
  await enterAppellantDOBAndContinueAfterSignIn(
    page,
    language,
    commonContent,
    appellant.dob.day,
    appellant.dob.month,
    appellant.dob.year
  );
  await enterAppellantNINOAndContinueAfterSignIn(page, language, commonContent, appellant.nino);
}

async function enterDetailsFromStartToDraft(
  page,
  commonContent,
  language,
  newUserEmail,
  benefitTypeCode = testDataEn.benefitType.code
) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  await signInVerifylanguage(page, newUserEmail, testDataEn.signIn.password, language);
  await createNewApplication(page, language);
  await enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  await enterPostcodeAndContinueAfterSignIn(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
}

async function enterDetailsForNewApplication(
  page,
  commonContent,
  language,
  userEmail,
  benefitTypeCode = testDataEn.benefitType.code
) {
  await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(page, language, commonContent, 'no');
  await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-yes');
  await signIn(page, userEmail, testDataEn.signIn.password, language);
  await createNewApplication(page, language);
  await enterBenefitTypeAfterSignIn(page, language, commonContent, benefitTypeCode);
  await chooseLanguagePreferenceAfterSignIn(page, language, commonContent, 'no');
  await enterPostcodeAndContinueAfterSignIn(page, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(page, commonContent);
  await selectHaveYouGotAMRNAndContinueAfterSignIn(page, language, commonContent, '#haveAMRN-yes');
  await enterAnMRNDateAndContinueAfterSignIn(page, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinueAfterSignIn(page, commonContent, testDataEn.mrn.dwpIssuingOffice);
}

async function enterDetailsToArchiveACase(page, commonContent, language, userEmail) {
  await page.goto(`${baseUrl}/sign-out`);
  await navigateToSignInLink(page);
  await signIn(page, userEmail, testDataEn.signIn.password, language);
  await verifyDraftAppealsAndArchiveACase(page, language);
}

async function enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent) {
  await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
  await addReasonForAppealingUsingTheOnePageFormAndContinue(
    page,
    language,
    commonContent,
    testDataEn.reasonsForAppealing.reasons[0]
  );
  await enterAnythingElseAndContinue(page, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    await readSendingEvidenceAndContinue(page, commonContent);
  }
  if (evidenceUploadEnabled) {
    await selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-yes');
    await uploadAPieceOfEvidence(page);
    await enterDescription(page, commonContent, 'Some description of the evidence');
  }
}
async function enterDetailsFromAttendingTheHearingToEnd(page, commonContent, language, date) {
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, commonContent, '#arrangements-yes');
  await checkAllArrangementsAndContinue(page, commonContent, language);
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-yes');
  await page.goto(paths.hearing.datesCantAttend);
  await page.waitForTimeout(2000);
  await enterDateCantAttendAndContinue(page, commonContent, date, datesCantAttendContent.links.add);
  await page.waitForTimeout(5000);
  await page.getByText(commonContent.continue).first().click();
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, date) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, supportContent.fields.arrangements.yes);
  await checkAllArrangementsAndContinue(page, commonContent, language);
  await page.waitForTimeout(1000);
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-yes');
  await page.waitForTimeout(1000);
  await selectDates(page, language, [date]);
  await page.getByText(commonContent.continue).first().click();
}

async function enterDetailsFromAttendingTheHearingWithSupportToEnd(page, commonContent, language, options, fields = []) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
  await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
  await selectDoYouNeedSupportAndContinue(page, language, supportContent.fields.arrangements.yes);
  await Promise.all(options.map(option => page.getByLabel(option).click()));
  await Promise.all(fields.map(field => page.fill(field.id, field.content)));
  await page.getByText(commonContent.continue).first().click();
  await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-no');
}

async function enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent) {
  await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
  await addReasonForAppealingUsingTheOnePageFormAndContinue(
    page,
    language,
    commonContent,
    testDataEn.reasonsForAppealing.reasons[0]
  );
  await enterAnythingElseAndContinue(page, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  // readSendingEvidenceAndContinue(page, commonContent);
  await selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-no');
}

async function enterDetailsFromNoRepresentativeToEnd(page, language, commonContent) {
  await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
  await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-no');
  await readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent);
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
  await page.waitForURL(`**/${paths.checkYourAppeal}`);

  // Type of benefit
  await expect(page.getByText(testData.benefitType.description).first()).toBeVisible();

  if (hasMRN) {
    // MRN address number
    await expect(page.getByText(testData.mrn.dwpIssuingOffice, selectors[language].mrn.dwpIssuingOffice).first()).toBeVisible();

    // The Date of the MRN
    await expect(page.getByText(DateUtils.formatDate(mrnDateToCheck, 'DD MMMM YYYY')).first()).toBeVisible();

    if (mrnDateToCheck.isAfter(oneMonthAgo)) {
      // Reason why the MRN is late
      await expect(page.getByText(testData.mrn.reasonWhyMRNisLate).first()).toBeVisible();
    }
  } else {
    // Reason for no MRN
    await expect(page.getByText(testData.mrn.reasonForNoMRN, selectors[language].mrn.noMRN).first()).toBeVisible();
  }

  // Appellant name
  await expect(page.getByText(`${appellant.title}. ${appellant.firstName} ${appellant.lastName}`).first()).toBeVisible();

  // Appellant DOB
  if (language === 'en') {
    await expect(page.getByText('25 January 1980').first()).toBeVisible();
  } else {
    await expect(page.getByText('25 Ionawr 1980').first()).toBeVisible();
  }

  // Appellant NINO
  await expect(page.getByText(appellant.nino).first()).toBeVisible();

  // Appellant address
  await expect(page.getByText(appellant.contactDetails.addressLine1).first()).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.addressLine2).first()).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.townCity).first()).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.county).first()).toBeVisible();
  await expect(page.getByText(appellant.contactDetails.postCode).first()).toBeVisible();

  // Appellant Reason for appealing
  await expect(page.getByText(testData.reasonsForAppealing.reasons[0].whatYouDisagreeWith).first()).toBeVisible();
  await expect(page.getByText(testData.reasonsForAppealing.reasons[0].reasonForAppealing).first()).toBeVisible();

  // Anything else the appellant wants to tell the tribunal
  await expect(page.getByText(testData.reasonsForAppealing.otherReasons).first()).toBeVisible();

  // Shows when the appeal is complete
  await expect(page.getByText(checkYourAppealContent.header).first()).toBeVisible();
}

async function checkYourAppealToConfirmationPage(page, language, signer) {
  await checkYourAppealToConfirmation(page, language, signer);
}

async function continueIncompleteAppeal(page, language) {
  await page.waitForURL(`**/${paths.checkYourAppeal}`);
  if (language === 'en') {
    await expect(page.getByText('Check your answers').first()).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Your application is incomplete').first()).toBeVisible();
    await expect(page.getByText('There are still some questions to answer.').first()).toBeVisible();
    await page.getByText('Continue your application').first().click();
  } else {
    await expect(page.getByText('Gwiriwch eich atebion').first()).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Mae eich cais yn anghyflawn').first()).toBeVisible();
    await expect(page.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.').first()).toBeVisible();
    await page.getByText('Parhau á’ch cais').first().click();
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

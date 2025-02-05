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
const { expect } = require('@playwright/test');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');
const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled').toString() === 'true';

const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');
const testDataEn = require('test/e2e/data.en');
const testDataCy = require('test/e2e/data.cy');
const { checkYourAppealToConfirmation } = require('./checkYourAnswers');
const { selectAreYouProvidingEvidenceAndContinue } = require('../upload-evidence/evidenceProvide');
const {
  selectIfYouWantToCreateAccount
} = require('../idam/createAccount');
const {
  enterBenefitTypeAndContinue,
  enterBenefitTypeAfterSignIn
} = require('../start/benefit-type');
const {
  enterAppellantNINOAndContinue,
  enterAppellantDOBAndContinue,
  enterAppellantNameAndContinue,
  enterAppellantNINOAndContinueAfterSignIn,
  enterAppellantDOBAndContinueAfterSignIn,
  enterAppellantNameAndContinueAfterSignIn
} = require('../identity/appellantDetails');
const {
  selectAreYouAnAppointeeAndContinue,
  selectAreYouAnAppointeeAndContinueAfterSignIn
} = require('../identity/appointee');
const {
  enterDWPIssuingOfficeAndContinue,
  enterDWPIssuingOfficeAndContinueAfterSignIn, enterDWPIssuingOffice
} = require('../compliance/dwpIssuingOffice');
const {
  enterAnMRNDateAndContinue,
  enterAnMRNDateAndContinueAfterSignIn
} = require('../compliance/mrnDate');
const {
  selectHaveYouGotAMRNAndContinue,
  selectHaveYouGotAMRNAndContinueAfterSignIn
} = require('../compliance/haveAMRN');
const {
  selectHearingAvailabilityAndContinue
} = require('../hearing/availability');
const { checkAllArrangementsAndContinue } = require('../hearing/arrangements');
const { selectDoYouNeedSupportAndContinue } = require('../hearing/support');
const {
  selectTelephoneHearingOptionsAndContinue
} = require('../hearing/options');
const {
  enterDoYouWantToAttendTheHearing,
  readYouHaveChosenNotToAttendTheHearingNoticeAndContinue
} = require('../hearing/theHearing');
const { readSendingEvidenceAndContinue } = require('../reasons-for-appealing/sendingEvidence');
const { enterAnythingElseAndContinue } = require('../reasons-for-appealing/reasonsForAppealing');
const { addReasonForAppealingUsingTheOnePageFormAndContinue } = require('../reasons-for-appealing/reasonForAppealingOnePageForm');
const {
  selectDoYouHaveARepresentativeAndContinue
} = require('../representative/representative');
const {
  verifyDraftAppealsAndArchiveACase,
  verifyDraftAppealsAndEditACase
} = require('../draft-appeals/draft-appeals-page');
const {
  enterPostcodeAndContinueAfterSignIn, enterPostcodeAndContinue
} = require('../start/postcode-checker');
const {
  chooseLanguagePreferenceAfterSignIn, chooseLanguagePreference
} = require('../start/language-preference');
const { enterDateCantAttendAndContinue, selectDates } = require('../hearing/datesCantAttend');
const { continueFromIndependance } = require('../start/independence');
const { signIn, navigateToSignInLink, signInVerifylanguage } = require('../sign-in/sign-in-with-valid-creds');
const { createNewApplication } = require('../draft-appeals/create-new-application');
const { signOut } = require('../sign-out/sign-out');
const { createTheSession } = require('../session/createSession');
const { uploadAPieceOfEvidence } = require('../upload-evidence/uploadEvidencePage');
const { enterDescription } = require('../upload-evidence/evidenceDescription');

const appellant = testDataEn.appellant;

// const oneMonthAgo = DateUtils.oneMonthAgo();

async function enterDetailsFromStartToNINO(I, commonContent, language, benefitTypeCode = testDataEn.benefitType.code) {
  const createAccountOption = I.url().includes('aat') ? '#createAccount-no' : '#createAccount-2';
  const haveAMRNOption = I.url().includes('aat') ? '#haveAMRN-yes' : '#haveAMRN';
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  //  if (actUrl === aatUrl) await chooseLanguagePreference(I, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  if (allowSaveAndReturnEnabled) {
    await selectIfYouWantToCreateAccount(I, language, commonContent, createAccountOption);
  }
  await selectHaveYouGotAMRNAndContinue(I, language, commonContent, haveAMRNOption);
  await enterAnMRNDateAndContinue(I, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinue(I, commonContent, testDataEn.mrn.dwpIssuingOffice);
  await selectAreYouAnAppointeeAndContinue(I, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinue(I, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  await enterAppellantDOBAndContinue(I, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  await enterAppellantNINOAndContinue(I, language, commonContent, testNIData.generateValidNINumber());
}

async function enterCaseDetailsFromStartToNINO(I, commonContent, language, benefitTypeCode, office, hasDwpIssuingOffice) {
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  // if (actUrl === aatUrl) await chooseLanguagePreference(I, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  if (allowSaveAndReturnEnabled) {
    await selectIfYouWantToCreateAccount(I, language, commonContent, '#createAccount-2');
  }
  await selectHaveYouGotAMRNAndContinue(I, language, commonContent, '#haveAMRN');
  await enterAnMRNDateAndContinue(I, commonContent, DateUtils.getRandomDateInLast30Days(language));
  if (hasDwpIssuingOffice) {
    await enterDWPIssuingOffice(I, commonContent, office);
  }
  await selectAreYouAnAppointeeAndContinue(I, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinue(I, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  await enterAppellantDOBAndContinue(I, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  await enterAppellantNINOAndContinue(I, language, commonContent, testNIData.generateValidNINumber());
}


async function enterDetailsFromStartToDraftAppeals(I, commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  /* Create new application */
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  await selectIfYouWantToCreateAccount(I, language, commonContent, '#createAccount');
  await signIn(I, newUserEmail, testDataEn.signIn.password, language);
  await createNewApplication(I, language);
  await enterBenefitTypeAfterSignIn(I, language, commonContent, benefitTypeCode);
  await signOut(I, language);

  /* Login to submit saved case */
  await createTheSession(I, language);
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  await selectIfYouWantToCreateAccount(I, language, commonContent, '#createAccount');
  await signIn(I, newUserEmail, testDataEn.signIn.password, language);
  await verifyDraftAppealsAndEditACase(I, language);
  await continueFromIndependance(I, commonContent);
  await selectHaveYouGotAMRNAndContinueAfterSignIn(I, language, commonContent, '#haveAMRN');
  await enterAnMRNDateAndContinueAfterSignIn(I, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinueAfterSignIn(I, commonContent, testDataEn.mrn.dwpIssuingOffice);
  await selectAreYouAnAppointeeAndContinueAfterSignIn(I, language, commonContent, '#isAppointee-no');
  await enterAppellantNameAndContinueAfterSignIn(I, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  await enterAppellantDOBAndContinueAfterSignIn(I, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  await enterAppellantNINOAndContinueAfterSignIn(I, language, commonContent, testNIData.generateValidNINumber());
}

async function enterDetailsFromStartToDraft(I, commonContent, language, newUserEmail, benefitTypeCode = testDataEn.benefitType.code) {
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  await selectIfYouWantToCreateAccount(I, language, commonContent, '#createAccount');
  await signInVerifylanguage(I, newUserEmail, testDataEn.signIn.password, language);
  await createNewApplication(I, language);
  await enterBenefitTypeAfterSignIn(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreferenceAfterSignIn(I, language, commonContent, 'no');
  await enterPostcodeAndContinueAfterSignIn(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
}

async function enterDetailsForNewApplication(I, commonContent, language, userEmail, benefitTypeCode = testDataEn.benefitType.code) {
  await enterBenefitTypeAndContinue(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreference(I, language, commonContent, 'no');
  await enterPostcodeAndContinue(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  await selectIfYouWantToCreateAccount(I, language, commonContent, '#createAccount');
  await signIn(I, userEmail, testDataEn.signIn.password, language);
  await createNewApplication(I, language);
  await enterBenefitTypeAfterSignIn(I, language, commonContent, benefitTypeCode);
  await chooseLanguagePreferenceAfterSignIn(I, language, commonContent, 'no');
  await enterPostcodeAndContinueAfterSignIn(I, language, commonContent, appellant.contactDetails.postCode);
  await continueFromIndependance(I, commonContent);
  await selectHaveYouGotAMRNAndContinueAfterSignIn(I, language, commonContent, '#haveAMRN');
  await enterAnMRNDateAndContinueAfterSignIn(I, commonContent, DateUtils.oneMonthAgo(language));
  await enterDWPIssuingOfficeAndContinueAfterSignIn(I, commonContent, testDataEn.mrn.dwpIssuingOffice);
}

async function enterDetailsToArchiveACase(I, commonContent, language, userEmail) {
  await I.goto('/sign-out');
  await navigateToSignInLink(I);
  await signIn(I, userEmail, testDataEn.signIn.password, language);
  await verifyDraftAppealsAndArchiveACase(I, language);
}

async function enterDetailsFromNoRepresentativeToUploadingEvidence(I, language, commonContent) {
  await selectDoYouHaveARepresentativeAndContinue(I, commonContent, '#hasRepresentative-2');
  await addReasonForAppealingUsingTheOnePageFormAndContinue(I, language, commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  await enterAnythingElseAndContinue(I, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    await readSendingEvidenceAndContinue(I, commonContent);
  }
  if (evidenceUploadEnabled) {
    await selectAreYouProvidingEvidenceAndContinue(I, language, commonContent, '#evidenceProvide');
    await uploadAPieceOfEvidence(I);
    await enterDescription(I, commonContent, 'Some description of the evidence');
  }
}

async function enterDetailsFromNoRepresentativeToNoUploadingEvidence(I, language, commonContent) {
  await selectDoYouHaveARepresentativeAndContinue(I, commonContent, '#hasRepresentative-2');
  await addReasonForAppealingUsingTheOnePageFormAndContinue(I, language, commonContent, testDataEn.reasonsForAppealing.reasons[0]);
  await enterAnythingElseAndContinue(I, language, commonContent, testDataEn.reasonsForAppealing.otherReasons);
  // await readSendingEvidenceAndContinue(I, commonContent);
  await selectAreYouProvidingEvidenceAndContinue(I, language, commonContent, '#evidenceProvide-2');
}

async function enterDetailsFromNoRepresentativeToEnd(I, language, commonContent) {
  await enterDetailsFromNoRepresentativeToNoUploadingEvidence(I, language, commonContent);
  await enterDoYouWantToAttendTheHearing(I, language, commonContent, '#attendHearing-2');
  await readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(I, commonContent);
}

async function enterDetailsFromAttendingTheHearingToEnd(I, commonContent, language, date) {
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  await enterDoYouWantToAttendTheHearing(I, language, commonContent, '#attendHearing');
  await selectTelephoneHearingOptionsAndContinue(I, language, commonContent);
  await selectDoYouNeedSupportAndContinue(I, language, commonContent, '#arrangements');
  await checkAllArrangementsAndContinue(I, commonContent, language);
  await selectHearingAvailabilityAndContinue(I, language, commonContent, '#hasRepresentative');
  await I.goto(paths.hearing.datesCantAttend);
  await enterDateCantAttendAndContinue(I, commonContent, date, datesCantAttendContent.links.add);
  await I.click(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(I, commonContent, language, date) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(I, language, commonContent, '#attendHearing');
  await selectTelephoneHearingOptionsAndContinue(I, language, commonContent);
  await selectDoYouNeedSupportAndContinue(I, language, commonContent, supportContent.fields.arrangements.yes);
  await checkAllArrangementsAndContinue(I, commonContent, language);
  await selectHearingAvailabilityAndContinue(I, language, commonContent, '#hasRepresentative');
  await selectDates(I, language, [date]);
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

async function enterDetailsFromAttendingTheHearingWithSupportToEnd(I, commonContent, language, options, fields = []) {
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;

  await enterDoYouWantToAttendTheHearing(I, language, commonContent, '#attendHearing');
  await selectTelephoneHearingOptionsAndContinue(I, language, commonContent);
  await selectDoYouNeedSupportAndContinue(I, language, commonContent, supportContent.fields.arrangements.yes);
  await Promise.all(options.map(option =>
    I.getByText(option).first().click()
  ));
  await Promise.all(fields.map(field =>
    I.locator(`#${field.id}`).first().fill(field.content)
  ));
  await I.getByRole('button', { name: commonContent.continue }).first().click();
  await selectHearingAvailabilityAndContinue(I, language, commonContent, '#scheduleHearing-2');
}

async function confirmDetailsArePresent(I, language, hasMRN = true, mrnDate) {
  const testData = language === 'en' ? testDataEn : testDataCy;
  const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  const oneMonthAgo = DateUtils.oneMonthAgo(language);
  let mrnDateToCheck = mrnDate;

  if (hasMRN && !mrnDate) {
    mrnDateToCheck = oneMonthAgo;
  }

  // We are on CYA
  await I.waitForURL(paths.checkYourAppeal);

  // Type of benefit
  await expect(I.getByText(testData.benefitType.description).first()).toBeVisible();

  if (hasMRN) {
    // MRN address number
    await expect(I.getByText(testData.mrn.dwpIssuingOffice, selectors[language].mrn.dwpIssuingOffice).first()).toBeVisible();

    // The Date of the MRN
    await expect(I.getByText(DateUtils.formatDate(mrnDateToCheck, 'DD MMMM YYYY')).first()).toBeVisible();

    if (mrnDateToCheck.isAfter(oneMonthAgo)) {
      // Reason why the MRN is late
      await expect(I.getByText(testData.mrn.reasonWhyMRNisLate).first()).toBeVisible();
    }
  } else {
    // Reason for no MRN
    await expect(I.getByText(testData.mrn.reasonForNoMRN, selectors[language].mrn.noMRN).first()).toBeVisible();
  }

  // Appellant name
  await expect(I.getByText(`${appellant.title}. ${appellant.firstName} ${appellant.lastName}`).first()).toBeVisible();

  // Appellant DOB
  if (language === 'en') {
    await expect(I.getByText('25 January 1980').first()).toBeVisible();
  } else {
    await expect(I.getByText('25 Ionawr 1980').first()).toBeVisible();
  }

  // Appellant NINO
  // await expect(I.getByText(appellant.nino).first()).toBeVisible();

  // Appellant address
  await expect(I.getByText(appellant.contactDetails.addressLine1).first()).toBeVisible();
  if (appellant.contactDetails.addressLine2 !== '') {
    await expect(I.getByText(appellant.contactDetails.addressLine2).first()).toBeVisible();
  }
  await expect(I.getByText(appellant.contactDetails.townCity).first()).toBeVisible();
  await expect(I.getByText(appellant.contactDetails.county).first()).toBeVisible();
  await expect(I.getByText(appellant.contactDetails.postCode).first()).toBeVisible();

  // Appellant Reason for appealing
  await expect(I.getByText(testData.reasonsForAppealing.reasons[0].whatYouDisagreeWith).first()).toBeVisible();
  await expect(I.getByText(testData.reasonsForAppealing.reasons[0].reasonForAppealing).first()).toBeVisible();

  // Anything else the appellant wants to tell the tribunal
  await expect(I.getByText(testData.reasonsForAppealing.otherReasons).first()).toBeVisible();

  // Shows when the appeal is complete
  await expect(I.getByText(checkYourAppealContent.header).first()).toBeVisible();
}

async function checkYourAppealToConfirmationPage(I, language, signer) {
  await checkYourAppealToConfirmation(I, language, signer);
}

async function continueIncompleteAppeal(I, language) {
  await I.waitForURL(paths.checkYourAppeal);
  if (language === 'en') {
    await expect(I.getByText('Check your answers').first()).toBeVisible();
    await expect(I.getByText('Your application is incomplete').first()).toBeVisible();
    await expect(I.getByText('There are still some questions to answer.').first()).toBeVisible();
    await I.getByText('Continue your application').first().click();
  } else {
    await expect(I.getByText('Gwiriwch eich atebion').first()).toBeVisible();
    await expect(I.getByText('Mae eich cais yn anghyflawn').first()).toBeVisible();
    await expect(I.getByText('Mae yna gwestiynau nad ydych wedi’u hateb.').first()).toBeVisible();
    await I.getByText('Parhau á’ch cais').first().click();
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

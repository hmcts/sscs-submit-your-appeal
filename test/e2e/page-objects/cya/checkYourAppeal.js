const DateUtils = require('utils/DateUtils');
const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const haveAMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveAMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');
const representativeContentEn = require('steps/representative/representative/content.en');
const representativeContentCy = require('steps/representative/representative/content.cy');
const theHearingContentEn = require('steps/hearing/the-hearing/content.en');
const theHearingContentCy = require('steps/hearing/the-hearing/content.cy');
const supportContentEn = require('steps/hearing/support/content.en');
const supportContentCy = require('steps/hearing/support/content.cy');
const availabilityContentEn = require('steps/hearing/availability/content.en');
const availabilityContentCy = require('steps/hearing/availability/content.cy');
const datesCantAttendContentEn = require('steps/hearing/dates-cant-attend/content.en');
const datesCantAttendContentCy = require('steps/hearing/dates-cant-attend/content.cy');
const evidenceProvideContentEn = require('steps/reasons-for-appealing/evidence-provide/content.en');
const evidenceProvideContentCy = require('steps/reasons-for-appealing/evidence-provide/content.cy');
const config = require('config');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');
const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled') === 'true';

const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');
const testData = require('test/e2e/data');

const appellant = testData.appellant;
const oneMonthAgo = DateUtils.oneMonthAgo();

function enterDetailsFromStartToNINO(commonContent, language, benefitTypeCode = testData.benefitType.code) {
  const I = this;
  const haveAMRNContent = language === 'en' ? haveAMRNContentEn : haveAMRNContentCy;
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  // I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(commonContent, 'no');
  }
  I.selectHaveYouGotAMRNAndContinue(commonContent, haveAMRNContent.fields.haveAMRN.yes);
  I.enterAnMRNDateAndContinue(commonContent, oneMonthAgo);
  I.enterDWPIssuingOfficeAndContinue(commonContent, testData.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinue(commonContent, appointeeContent.fields.isAppointee.no);
  I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
}

function enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language) {
  const I = this;
  const representativeContent = language === 'en' ? representativeContentEn : representativeContentCy;
  const evidenceProvideContent = language === 'en' ? evidenceProvideContentEn : evidenceProvideContentCy;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, representativeContent.fields.hasRepresentative.no);
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(commonContent, testData.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(commonContent, testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(commonContent, evidenceProvideContent.fields.evidenceProvide.yes);
    I.uploadAPieceOfEvidence();
    I.enterDescription(commonContent, 'Some description of the evidence');
  }
}

function enterDetailsFromNoRepresentativeToEnd(commonContent, language) {
  const I = this;

  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
  I.enterDoYouWantToAttendTheHearing(commonContent, 'No');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(commonContent);
}

async function enterDetailsFromAttendingTheHearingToEnd(commonContent, language, date) {
  const I = this;
  const theHearingContent = language === 'en' ? theHearingContentEn : theHearingContentCy;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;
  const availabilityContent = language === 'en' ? availabilityContentEn : availabilityContentCy;
  const datesCantAttendContent = language === 'en' ? datesCantAttendContentEn : datesCantAttendContentCy;

  I.enterDoYouWantToAttendTheHearing(commonContent, theHearingContent.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(commonContent, supportContent.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.selectHearingAvailabilityAndContinue(commonContent, availabilityContent.fields.scheduleHearing.yes);
  await I.turnOffJsAndReloadThePage();
  I.enterDateCantAttendAndContinue(commonContent, date, datesCantAttendContent.links.add);
  I.click(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, date) {
  const I = this;
  const theHearingContent = language === 'en' ? theHearingContentEn : theHearingContentCy;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;
  const availabilityContent = language === 'en' ? availabilityContentEn : availabilityContentCy;

  I.enterDoYouWantToAttendTheHearing(theHearingContent.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(supportContent.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.wait(2);
  I.selectHearingAvailabilityAndContinue(commonContent, availabilityContent.fields.scheduleHearing.yes);
  I.wait(2);
  await I.selectDates([date]);
  I.click(commonContent.continue);
}

function enterDetailsFromAttendingTheHearingWithSupportToEnd(commonContent, language, options, fields = []) {
  const I = this;
  const theHearingContent = language === 'en' ? theHearingContentEn : theHearingContentCy;
  const supportContent = language === 'en' ? supportContentEn : supportContentCy;
  const availabilityContent = language === 'en' ? availabilityContentEn : availabilityContentCy;

  I.enterDoYouWantToAttendTheHearing(theHearingContent.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(supportContent.fields.arrangements.yes);
  options.forEach(option => {
    I.click(option);
  });
  fields.forEach(field => {
    I.fillField(field.id, field.content);
  });
  I.click('Continue');
  I.selectHearingAvailabilityAndContinue(availabilityContent.fields.scheduleHearing.no);
}

function confirmDetailsArePresent(language, hasMRN = true, mrnDate = oneMonthAgo) {
  const I = this;
  const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;

  // We are on CYA
  I.seeCurrentUrlEquals(paths.checkYourAppeal);

  // Type of benefit
  I.see(testData.benefitType.description);

  if (hasMRN) {
    // MRN address number
    I.see(testData.mrn.dwpIssuingOffice, selectors.mrn.dwpIssuingOffice);

    // The Date of the MRN
    I.see(mrnDate.format('DD MMMM YYYY'));

    if (mrnDate.isAfter(oneMonthAgo)) {
      // Reason why the MRN is late
      I.see(testData.mrn.reasonWhyMRNisLate);
    }
  } else {
    // Reason for no MRN
    I.see(testData.mrn.reasonForNoMRN, selectors.mrn.noMRN);
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

module.exports = {
  enterDetailsFromStartToNINO,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromAttendingTheHearingToEnd,
  enterDetailsFromAttendingTheHearingDatePickerToEnd,
  enterDetailsFromNoRepresentativeToEnd,
  confirmDetailsArePresent,
  enterDetailsFromAttendingTheHearingWithSupportToEnd
};

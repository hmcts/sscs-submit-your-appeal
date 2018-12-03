const DateUtils = require('utils/DateUtils');
const haveAMRN = require('steps/compliance/have-a-mrn/content.en.json');
const appointee = require('steps/identity/appointee/content.en.json');
const representative = require('steps/representative/representative/content.en');
const theHearing = require('steps/hearing/the-hearing/content.en');
const support = require('steps/hearing/support/content.en');
const availability = require('steps/hearing/availability/content.en');
const datesCantAttend = require('steps/hearing/dates-cant-attend/content.en');
const evidenceProvide = require('steps/reasons-for-appealing/evidence-provide/content.en.json');

const config = require('config');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

const selectors = require('steps/check-your-appeal/selectors');
const paths = require('paths');
const testData = require('test/e2e/data');

const appellant = testData.appellant;
const oneMonthAgo = DateUtils.oneMonthAgo();

function enterDetailsFromStartToNINO(benefitTypeCode = testData.benefitType.code) {
  const I = this;
  I.enterBenefitTypeAndContinue(benefitTypeCode);
  I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
  I.selectAreYouAnAppointeeAndContinue(appointee.fields.isAppointee.no);
  I.continueFromIndependance();
  I.selectHaveYouGotAMRNAndContinue(haveAMRN.fields.haveAMRN.yes);
  I.enterAnMRNDateAndContinue(oneMonthAgo);
  I.enterDWPIssuingOfficeAndContinue(testData.mrn.dwpIssuingOffice);
  I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(appellant.nino);
}

function enterDetailsFromNoRepresentativeToUploadingEvidence() {
  const I = this;

  I.selectDoYouHaveARepresentativeAndContinue(representative.fields.hasRepresentative.no);
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(testData.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue();
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(evidenceProvide.fields.evidenceProvide.yes);
    I.uploadAPieceOfEvidence();
    I.enterDescription('Some description of the evidence');
  }
}

function enterDetailsFromNoRepresentativeToEnd() {
  const I = this;

  I.enterDetailsFromNoRepresentativeToUploadingEvidence();
  I.enterDoYouWantToAttendTheHearing('No');
  I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();
}

async function enterDetailsFromAttendingTheHearingToEnd(date) {
  const I = this;

  I.enterDoYouWantToAttendTheHearing(theHearing.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(support.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue();
  I.selectHearingAvailabilityAndContinue(availability.fields.scheduleHearing.yes);
  await I.turnOffJsAndReloadThePage();
  I.enterDateCantAttendAndContinue(date, datesCantAttend.links.add);
  I.click('Continue');
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(date) {
  const I = this;

  I.enterDoYouWantToAttendTheHearing(theHearing.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(support.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue();
  I.wait(2);
  I.selectHearingAvailabilityAndContinue(availability.fields.scheduleHearing.yes);
  I.wait(2);
  await I.selectDates([date]);
  I.click('Continue');
}

function enterDetailsFromAttendingTheHearingWithSupportToEnd(options, fields = []) {
  const I = this;

  I.enterDoYouWantToAttendTheHearing(theHearing.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(support.fields.arrangements.yes);
  options.forEach(option => {
    I.click(option);
  });
  fields.forEach(field => {
    I.fillField(field.id, field.content);
  });
  I.click('Continue');
  I.selectHearingAvailabilityAndContinue(availability.fields.scheduleHearing.no);
}

function confirmDetailsArePresent(hasMRN = true, mrnDate = oneMonthAgo) {
  const I = this;

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
  I.see(`${appellant.title} ${appellant.firstName} ${appellant.lastName}`);

  // Appellant DOB
  I.see('25 January 1980');

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
  I.see('Sign and submit');
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

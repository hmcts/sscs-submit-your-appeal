const DateUtils = require('utils/DateUtils');
const checkYourAppealEn = require('steps/check-your-appeal/content.en.json');
const checkYourAppealCy = require('steps/check-your-appeal/content.cy.json');
const haveAMRNEn = require('steps/compliance/have-a-mrn/content.en.json');
const haveAMRNCy = require('steps/compliance/have-a-mrn/content.cy.json');
const appointeeEn = require('steps/identity/appointee/content.en.json');
const appointeeCy = require('steps/identity/appointee/content.cy.json');
const representativeEn = require('steps/representative/representative/content.en');
const representativeCy = require('steps/representative/representative/content.cy');
const theHearingEn = require('steps/hearing/the-hearing/content.en');
const theHearingCy = require('steps/hearing/the-hearing/content.cy');
const supportEn = require('steps/hearing/support/content.en');
const supportCy = require('steps/hearing/support/content.cy');
const availabilityEn = require('steps/hearing/availability/content.en');
const availabilityCy = require('steps/hearing/availability/content.cy');
const datesCantAttendEn = require('steps/hearing/dates-cant-attend/content.en');
const datesCantAttendCy = require('steps/hearing/dates-cant-attend/content.cy');
const evidenceProvideEn = require('steps/reasons-for-appealing/evidence-provide/content.en.json');
const evidenceProvideCy = require('steps/reasons-for-appealing/evidence-provide/content.cy.json');
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
  const haveAMRN = language === 'en' ? haveAMRNEn : haveAMRNCy;
  const appointee = language === 'en' ? appointeeEn : appointeeCy;

  I.enterBenefitTypeAndContinue(commonContent, benefitTypeCode);
  // I.chooseLanguagePreference(commonContent, 'no');
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(commonContent, 'no');
  }
  I.selectHaveYouGotAMRNAndContinue(commonContent, haveAMRN.fields.haveAMRN.yes);
  I.enterAnMRNDateAndContinue(commonContent, oneMonthAgo);
  I.enterDWPIssuingOfficeAndContinue(commonContent, testData.mrn.dwpIssuingOffice);
  I.selectAreYouAnAppointeeAndContinue(commonContent, appointee.fields.isAppointee.no);
  I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
}

function enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language) {
  const I = this;
  const representative = language === 'en' ? representativeEn : representativeCy;
  const evidenceProvide = language === 'en' ? evidenceProvideEn : evidenceProvideCy;

  I.selectDoYouHaveARepresentativeAndContinue(commonContent, representative.fields.hasRepresentative.no);
  I.addReasonForAppealingUsingTheOnePageFormAndContinue(commonContent, testData.reasonsForAppealing.reasons[0]);
  I.enterAnythingElseAndContinue(commonContent, testData.reasonsForAppealing.otherReasons);
  if (!evidenceUploadEnabled) {
    I.readSendingEvidenceAndContinue(commonContent);
  }
  if (evidenceUploadEnabled) {
    I.selectAreYouProvidingEvidenceAndContinue(commonContent, evidenceProvide.fields.evidenceProvide.yes);
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
  const theHearing = language === 'en' ? theHearingEn : theHearingCy;
  const support = language === 'en' ? supportEn : supportCy;
  const availability = language === 'en' ? availabilityEn : availabilityCy;
  const datesCantAttend = language === 'en' ? datesCantAttendEn : datesCantAttendCy;

  I.enterDoYouWantToAttendTheHearing(commonContent, theHearing.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(commonContent, support.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.selectHearingAvailabilityAndContinue(commonContent, availability.fields.scheduleHearing.yes);
  await I.turnOffJsAndReloadThePage();
  I.enterDateCantAttendAndContinue(commonContent, date, datesCantAttend.links.add);
  I.click(commonContent.continue);
}

async function enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, date) {
  const I = this;
  const theHearing = language === 'en' ? theHearingEn : theHearingCy;
  const support = language === 'en' ? supportEn : supportCy;
  const availability = language === 'en' ? availabilityEn : availabilityCy;

  I.enterDoYouWantToAttendTheHearing(theHearing.fields.attendHearing.yes);
  I.selectDoYouNeedSupportAndContinue(support.fields.arrangements.yes);
  I.checkAllArrangementsAndContinue(commonContent, language);
  I.wait(2);
  I.selectHearingAvailabilityAndContinue(commonContent, availability.fields.scheduleHearing.yes);
  I.wait(2);
  await I.selectDates([date]);
  I.click(commonContent.continue);
}

function enterDetailsFromAttendingTheHearingWithSupportToEnd(commonContent, language, options, fields = []) {
  const I = this;
  const theHearing = language === 'en' ? theHearingEn : theHearingCy;
  const support = language === 'en' ? supportEn : supportCy;
  const availability = language === 'en' ? availabilityEn : availabilityCy;

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

function confirmDetailsArePresent(language, hasMRN = true, mrnDate = oneMonthAgo) {
  const I = this;
  const checkYourAppeal = language === 'en' ? checkYourAppealEn : checkYourAppealCy;

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
  I.see(checkYourAppeal.header);
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

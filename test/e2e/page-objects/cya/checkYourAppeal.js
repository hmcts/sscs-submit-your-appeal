const DateUtils = require('utils/DateUtils');
const haveAMRNContent = require('steps/compliance/have-a-mrn/content.en.json');
const appointeeContent = require('steps/identity/appointee/content.en.json');
const representativeContent = require('steps/representative/representative/content.en');
const theHearingContent = require('steps/hearing/the-hearing/content.en');
const supportContent = require('steps/hearing/support/content.en');
const availabilityContent = require('steps/hearing/availability/content.en');
const datesCantAttendContent = require('steps/hearing/dates-cant-attend/content.en');
const reasonsForAppealingContent = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const oneMonthAgo = DateUtils.oneMonthAgo();
const selectors = require('steps/check-your-appeal/selectors');
const moment = require('moment');
const paths = require('paths');
const data = require('test/e2e/data');
const appellant = data.appellant;

function enterDetailsFromStartToNINO() {

    const I = this;

    I.enterBenefitTypeAndContinue(data.benefitType.code);
    I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
    I.continueFromIndependance();
    I.selectHaveYouGotAMRNAndContinue(haveAMRNContent.fields.haveAMRN.yes);
    I.enterDWPIssuingOfficeAndContinue(data.mrn.dwpIssuingOffice);
    I.enterAnMRNDateAndContinue(oneMonthAgo);
    I.selectAreYouAnAppointeeAndContinue(appointeeContent.fields.isAppointee.no);
    I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinue(appellant.nino);

}

function enterDetailsFromNoRepresentativeToSendingEvidence() {

    const I = this;

    I.selectDoYouHaveARepresentativeAndContinue(representativeContent.fields.hasRepresentative.no);
    I.addReasonsForAppealingAndContinue(data.reasonsForAppealing.reasons[0], reasonsForAppealingContent.links.add);
    I.enterAnythingElseAndContinue(data.reasonsForAppealing.otherReasons);
    I.readSendingEvidenceAndContinue();

}

function enterDetailsFromNoRepresentativeToEnd() {

    const I = this;

    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDoYouWantToAttendTheHearing('No');
    I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();

}

function enterDetailsFromAttendingTheHearingToEnd() {

    const I = this;

    I.enterDoYouWantToAttendTheHearing(theHearingContent.fields.attendHearing.yes);
    I.selectDoYouNeedSupportAndContinue(supportContent.fields.arrangements.yes);
    I.checkAllArrangementsAndContinue();
    I.selectHearingAvailabilityAndContinue(availabilityContent.fields.scheduleHearing.yes);
    I.enterDateCantAttendAndContinue(moment().add(10, 'weeks'), datesCantAttendContent.links.add);
    I.click('Continue');

}

function confirmDetailsArePresent(hasMRN=true) {

    const I = this;

    // We are on CYA
    I.seeCurrentUrlEquals(paths.checkYourAppeal);

    // Type of benefit
    I.see(data.benefitType.description);

    if(hasMRN) {

        // MRN address number
        I.see(data.mrn.dwpIssuingOffice, selectors.mrn.dwpIssuingOffice);

        // Date of MRN
        I.see(oneMonthAgo.format('DD MMMM YYYY'));
    } else {

        // Reason for no MRN
        I.see(data.mrn.reasonForNoMRN, selectors.mrn.noMRN);
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
    I.see(data.reasonsForAppealing.reasons[0].whatYouDisagreeWith);
    I.see(data.reasonsForAppealing.reasons[0].reasonForAppealing);

    // Anything else the appellant wants to tell the tribunal
    I.see(data.reasonsForAppealing.otherReasons);

    // Shows when the appeal is complete
    I.see('Sign and submit');

}

module.exports = {
    enterDetailsFromStartToNINO,
    enterDetailsFromNoRepresentativeToSendingEvidence,
    enterDetailsFromAttendingTheHearingToEnd,
    enterDetailsFromNoRepresentativeToEnd,
    confirmDetailsArePresent
};

const DateUtils = require('utils/DateUtils');
const haveAMRNContent = require('steps/compliance/have-a-mrn/content.en.json');
const appointeeContent = require('steps/identity/appointee/content.en.json');
const representativeContent = require('steps/representative/representative/content.en');
const theHearingContent = require('steps/hearing/the-hearing/content.en');
const supportContent = require('steps/hearing/support/content.en');
const availabilityContent = require('steps/hearing/availability/content.en');
const datesCantAttendContent = require('steps/hearing/dates-cant-attend/content.en');
const oneMonthAgo = DateUtils.oneMonthAgo();
const selectors = require('steps/check-your-appeal/selectors');
const moment = require('moment');

function enterDetailsFromStartToNINO() {

    const I = this;

    I.enterBenefitTypeAndContinue('PIP');
    I.enterPostcodeAndContinue('WV11 2HE');
    I.continueFromIndependance();
    I.selectHaveYouGotAMRNAndContinue(haveAMRNContent.fields.haveAMRN.yes);
    I.enterDWPIssuingOfficeAndContinue('1');
    I.enterAnMRNDateAndContinue(oneMonthAgo);
    I.selectAreYouAnAppointeeAndContinue(appointeeContent.fields.isAppointee.no);
    I.enterAppellantNameAndContinue('Mr','Harry','Potter');
    I.enterAppellantDOBAndContinue('25','01','1980');
    I.enterAppellantNINOAndContinue('NX877564C');

}

function enterDetailsFromNoRepresentativeToSendingEvidence() {

    const I = this;

    I.selectDoYouHaveARepresentativeAndContinue(representativeContent.fields.hasRepresentative.no);
    I.enterReasonForAppealingAndContinue('A reason...');
    I.enterAnythingElseAndContinue('Anything else...');
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

function confirmDetailsArePresent() {

    const I = this;

    // We are on CYA
    I.seeCurrentUrlEquals('/check-your-appeal');

    // Type of benefit
    I.see('Personal Independence Payment (PIP)');

    // MRN address number
    I.see('1', selectors.mrn.dwpIssuingOffice);

    // Date of MRN
    I.see(oneMonthAgo.format('DD MMMM YYYY'));

    // Appellant name
    I.see('Mr Harry Potter');

    // Appellant DOB
    I.see('25 January 1980');

    // Appellant NINO
    I.see('NX877564C');

    // Appellant address
    I.see('4 Privet Drive');
    I.see('Off Wizards close');
    I.see('Little Whinging');
    I.see('Kent');
    I.see('PA80 5UU');

    // Appellant Reason for appealing
    I.see('A reason...');

    // Anything else the appellant wants to tell the tribunal
    I.see('Anything else...');

    // Shows when the appeal is complete
    I.see('Sign and submit');

};

module.exports = {
    enterDetailsFromStartToNINO,
    enterDetailsFromNoRepresentativeToSendingEvidence,
    enterDetailsFromAttendingTheHearingToEnd,
    enterDetailsFromNoRepresentativeToEnd,
    confirmDetailsArePresent
};

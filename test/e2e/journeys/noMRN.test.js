'use strict';

const haveContactedDWP = require('steps/compliance/have-contacted-dwp/content.en.json').fields.haveContactedDWP;
const haveAMRN = require('steps/compliance/have-a-mrn/content.en.json').fields.haveAMRN;
const isAppointee = require('steps/identity/appointee/content.en.json').fields.isAppointee;
const doYouWantTextMsgReminders = require('steps/sms-notify/text-reminders/content.en.json').fields.doYouWantTextMsgReminders;
const contactDWP = require('steps/compliance/contact-dwp/content.en');

const data = require('test/e2e/data');
const appellant = data.appellant;

const paths = require('paths');

Feature('Appellant does not have a MRN');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

Scenario('Appellant has contacted DWP', (I) => {

    const hasMRN = false;

    I.enterBenefitTypeAndContinue(data.benefitType.code);
    I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
    I.checkOptionAndContinue(isAppointee.no);
    I.continueFromIndependance();
    I.checkOptionAndContinue(haveAMRN.no);
    I.checkOptionAndContinue(haveContactedDWP.yes);
    I.enterReasonForNoMRNAndContinue(data.mrn.reasonForNoMRN);
    I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinue(appellant.nino);
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToSendingEvidence();
    I.enterDetailsFromAttendingTheHearingToEnd();
    I.confirmDetailsArePresent(hasMRN);

});

Scenario('Appellant has not contacted DWP and exits the service', (I) => {

    I.enterBenefitTypeAndContinue(data.benefitType.code);
    I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
    I.checkOptionAndContinue(isAppointee.no);
    I.continueFromIndependance();
    I.selectHaveYouGotAMRNAndContinue(haveAMRN.no);
    I.checkOptionAndContinue(haveContactedDWP.no);
    I.see(contactDWP.title);
    I.click(contactDWP.govuk);
    I.seeCurrentUrlEquals('https://www.gov.uk/');

});

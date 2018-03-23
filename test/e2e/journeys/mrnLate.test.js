const doYouWantTextMsgReminders = require('steps/sms-notify/text-reminders/content.en.json').fields.doYouWantTextMsgReminders;
const haveAMRN = require('steps/compliance/have-a-mrn/content.en.json').fields.haveAMRN;
const checkMRN = require('steps/compliance/check-mrn/content.en').fields.checkedMRN;
const isAppointee = require('steps/identity/appointee/content.en.json').fields.isAppointee;
const paths = require('paths');

const DateUtils = require('utils/DateUtils');
const oneMonthAndOneDayLate = { mrnDate: DateUtils.oneMonthAndOneDayAgo(), label: 'one month late' };
const thirteenMonthsAndOneDayLate = { mrnDate: DateUtils.thirteenMonthsAndOneDayAgo(), label: 'thirteen months late'};

const data = require('test/e2e/data');
const appellant = data.appellant;

Feature('Appellant has a dated MRN');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

[oneMonthAndOneDayLate, thirteenMonthsAndOneDayLate].forEach((obj)=> {

    Scenario(`Appellant has a MRN that is over ${obj.label}`, (I) => {

        I.enterBenefitTypeAndContinue(data.benefitType.code);
        I.enterPostcodeAndContinue(data.appellant.contactDetails.postCode);
        I.checkOptionAndContinue(isAppointee.no);
        I.continueFromIndependance();
        I.checkOptionAndContinue(haveAMRN.yes);
        I.enterDWPIssuingOfficeAndContinue(data.mrn.dwpIssuingOffice);
        I.enterAnMRNDateAndContinue(obj.mrnDate);
        I.checkOptionAndContinue(checkMRN.yes);
        I.enterReasonsForBeingLateAndContinue(data.mrn.reasonWhyMRNisLate);
        I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
        I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
        I.enterAppellantNINOAndContinue(appellant.nino);
        I.enterAppellantContactDetailsAndContinue();
        I.checkOptionAndContinue(doYouWantTextMsgReminders.no);
        I.enterDetailsFromNoRepresentativeToEnd();
        I.confirmDetailsArePresent(true, obj.mrnDate);

    });

});

const textRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const haveAMRN = require('steps/compliance/have-a-mrn/content.en.json').fields.haveAMRN;
const checkMRN = require('steps/compliance/check-mrn/content.en').fields.checkedMRN;
const isAppointee = require('steps/identity/appointee/content.en.json').fields.isAppointee;
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const testData = require('test/e2e/data');

const doYouWantTextMsgReminders = textRemindersContent.fields.doYouWantTextMsgReminders;
const appellant = testData.appellant;

const oneMonthAndOneDayLate = {
  mrnDate: DateUtils.oneMonthAndOneDayAgo(),
  label: 'one month late'
};

const thirteenMonthsAndOneDayLate = {
  mrnDate: DateUtils.thirteenMonthsAndOneDayAgo(),
  label: 'thirteen months late'
};

Feature('Appellant has a dated MRN @batch-03');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

[oneMonthAndOneDayLate, thirteenMonthsAndOneDayLate].forEach(obj => {
  Scenario(`Appellant has a MRN that is over ${obj.label}`, I => {
    I.wait(2);
    I.enterBenefitTypeAndContinue(testData.benefitType.code);
    I.chooseLanguagePreference(testData.languagePreferenceWelsh);
    I.enterPostcodeAndContinue(testData.appellant.contactDetails.postCode);
    I.checkOptionAndContinue(isAppointee.no);
    I.continueFromIndependance();
    I.checkOptionAndContinue(haveAMRN.yes);
    I.enterDWPIssuingOfficeAndContinue(testData.mrn.dwpIssuingOffice);
    I.enterAnMRNDateAndContinue(obj.mrnDate);
    I.checkOptionAndContinue(checkMRN.yes);
    I.enterReasonsForBeingLateAndContinue(testData.mrn.reasonWhyMRNisLate);
    I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinue(appellant.nino);
    I.enterAppellantContactDetailsAndContinue();
    I.checkOptionAndContinue(doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToEnd();
    I.confirmDetailsArePresent(true, obj.mrnDate);
  }).retry(1);
});

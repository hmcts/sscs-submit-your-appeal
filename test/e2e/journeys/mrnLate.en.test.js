const language = 'en';
const commonContent = require('commonContent')[language];
const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data.en');

const appellant = testData.appellant;

const oneMonthAndOneDayLate = {
  mrnDate: DateUtils.oneMonthAndOneDayAgo(language),
  label: 'one month late'
};
const thirteenMonthsAndOneDayLate = {
  mrnDate: DateUtils.thirteenMonthsAndOneDayAgo(language),
  label: 'thirteen months late'
};

Feature(`${language.toUpperCase()} - Appellant has a dated MRN @batch-03`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

[oneMonthAndOneDayLate, thirteenMonthsAndOneDayLate].forEach(obj => {
  Scenario(`${language.toUpperCase()} - Appellant has a MRN that is over ${obj.label}`, ({ I }) => {
    I.wait(1);
    I.enterBenefitTypeAndContinue(language, commonContent, testData.benefitType.code);
    I.enterPostcodeAndContinue(language, commonContent, testData.appellant.contactDetails.postCode);
    I.checkOptionAndContinue(commonContent, '#isAppointee-no');
    I.continueFromIndependance(commonContent);
    I.checkOptionAndContinue(commonContent, '#haveAMRN-yes');
    I.enterDWPIssuingOfficeAndContinue(commonContent, testData.mrn.dwpIssuingOffice);
    I.enterAnMRNDateAndContinue(commonContent, obj.mrnDate);
    I.checkOptionAndContinue(commonContent, '#checkedMRN-yes');
    I.enterReasonsForBeingLateAndContinue(commonContent, testData.mrn.reasonWhyMRNisLate);
    I.enterAppellantNameAndContinue(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinue(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinue(language, commonContent, appellant.nino);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-no');
    I.enterDetailsFromNoRepresentativeToEnd(language, commonContent);
    I.confirmDetailsArePresent(language, true, obj.mrnDate);
  }).retry(1);
});

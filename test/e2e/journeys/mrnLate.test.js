const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const haveAMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveAMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const checkMRNContentEn = require('steps/compliance/check-mrn/content.en');
const checkMRNContentCy = require('steps/compliance/check-mrn/content.cy');
const isAppointeeContentEn = require('steps/identity/appointee/content.en');
const isAppointeeContentCy = require('steps/identity/appointee/content.cy');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const testData = require('test/e2e/data');

const appellant = testData.appellant;

const oneMonthAndOneDayLate = {
  mrnDate: DateUtils.oneMonthAndOneDayAgo(),
  label: 'one month late'
};

const thirteenMonthsAndOneDayLate = {
  mrnDate: DateUtils.thirteenMonthsAndOneDayAgo(),
  label: 'thirteen months late'
};

const languages = ['en', 'cy'];

Feature('Appellant has a dated MRN @batch-03');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

languages.forEach(language => {
  const commonContent = content[language];
  const doYouWantTextMsgRemindersContent = language === 'en' ? doYouWantTextMsgRemindersContentEn : doYouWantTextMsgRemindersContentCy;
  const haveAMRNContent = language === 'en' ? haveAMRNContentEn : haveAMRNContentCy;
  const checkMRNContent = language === 'en' ? checkMRNContentEn : checkMRNContentCy;
  const isAppointeeContent = language === 'en' ? isAppointeeContentEn : isAppointeeContentCy;

  [oneMonthAndOneDayLate, thirteenMonthsAndOneDayLate].forEach(obj => {
    Scenario(`${language.toUpperCase()} - Appellant has a MRN that is over ${obj.label}`, I => {
      I.wait(2);
      I.enterBenefitTypeAndContinue(commonContent, testData.benefitType.code);
      // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
      I.enterPostcodeAndContinue(commonContent, testData.appellant.contactDetails.postCode);
      I.checkOptionAndContinue(commonContent, isAppointeeContent.fields.isAppointee.no);
      I.continueFromIndependance(commonContent);
      I.checkOptionAndContinue(commonContent, haveAMRNContent.fields.haveAMRN.yes);
      I.enterDWPIssuingOfficeAndContinue(commonContent, testData.mrn.dwpIssuingOffice);
      I.enterAnMRNDateAndContinue(commonContent, obj.mrnDate);
      I.checkOptionAndContinue(commonContent, checkMRNContent.fields.checkedMRN.yes);
      I.enterReasonsForBeingLateAndContinue(commonContent, testData.mrn.reasonWhyMRNisLate);
      I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
      I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
      I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
      I.enterAppellantContactDetailsAndContinue(commonContent, language);
      I.checkOptionAndContinue(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
      I.enterDetailsFromNoRepresentativeToEnd(commonContent, language);
      I.confirmDetailsArePresent(language, true, obj.mrnDate);
    }).retry(1);
  });
});

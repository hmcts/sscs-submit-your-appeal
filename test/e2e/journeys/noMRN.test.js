const content = require('commonContent');
const doYouWantTextMsgRemindersContentEn = require('steps/sms-notify/text-reminders/content.en');
const doYouWantTextMsgRemindersContentCy = require('steps/sms-notify/text-reminders/content.cy');
const haveContactedDWPContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const haveContactedDWPContentCy = require('steps/compliance/have-contacted-dwp/content.cy');
const haveAMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveAMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');
const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');
const contactDWPContentEn = require('steps/compliance/contact-dwp/content.en');
const contactDWPContentCy = require('steps/compliance/contact-dwp/content.cy');

const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data');
const moment = require('moment');
const paths = require('paths');
const config = require('config');

const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled') === 'true';

const appellant = testData.appellant;

const languages = ['en', 'cy'];

Feature('Appellant does not have a MRN @batch-04');

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
  const haveContactedDWPContent = language === 'en' ? haveContactedDWPContentEn : haveContactedDWPContentCy;
  const haveAMRNContent = language === 'en' ? haveAMRNContentEn : haveAMRNContentCy;
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;
  const contactDWPContent = language === 'en' ? contactDWPContentEn : contactDWPContentCy;

  Scenario(`${language.toUpperCase()} - Appellant has contacted DWP`, async I => {
    const randomWeekDay = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
    );

    const hasMRN = false;

    I.enterBenefitTypeAndContinue(commonContent, testData.benefitType.code);
    // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
    I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
    I.checkOptionAndContinue(commonContent, appointeeContent.fields.isAppointee.no);
    I.continueFromIndependance(commonContent);
    I.checkOptionAndContinue(commonContent, haveAMRNContent.fields.haveAMRN.no);
    I.checkOptionAndContinue(commonContent, haveContactedDWPContent.fields.haveContactedDWP.yes);
    I.enterReasonForNoMRNAndContinue(commonContent, testData.mrn.reasonForNoMRN);
    I.continueFromStillCanAppeal(language);
    I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
    I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
    I.enterAppellantContactDetailsAndContinue(commonContent, language);
    I.selectDoYouWantToReceiveTextMessageReminders(commonContent, doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders.no);
    I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent, language);
    await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, randomWeekDay);
    I.confirmDetailsArePresent(language, hasMRN);
  }).retry(1);

  Scenario(`${language.toUpperCase()} - Appellant has not contacted DWP and exits the service`, I => {
    I.enterBenefitTypeAndContinue(commonContent, testData.benefitType.code);
    // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
    I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
    I.checkOptionAndContinue(commonContent, appointeeContent.fields.isAppointee.no);
    I.continueFromIndependance(commonContent);
    if (allowSaveAndReturnEnabled) {
      I.selectIfYouWantToCreateAccount(commonContent, 'no');
    }
    I.selectHaveYouGotAMRNAndContinue(commonContent, haveAMRNContent.fields.haveAMRN.no);
    I.checkOptionAndContinue(commonContent, haveContactedDWPContent.fields.haveContactedDWP.no);
    I.see(contactDWPContent.title);
    I.click(contactDWPContent.govuk);
    I.seeCurrentUrlEquals('https://www.gov.uk/');
  }).retry(1);
});

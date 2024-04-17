const language = 'en';
const commonContent = require('commonContent')[language];
const contactDWPContent = require(`steps/compliance/contact-dwp/content.${language}`);

const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data.en');
const moment = require('moment');
const config = require('config');

const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled') === 'true';

const appellant = testData.appellant;

Feature(`${language.toUpperCase()} - Appellant does not have a MRN @batch-04`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant has contacted DWP`, async({ I }) => {
  const randomWeekDay = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
  );

  const hasMRN = false;

  I.enterBenefitTypeAndContinue(language, commonContent, testData.benefitType.code);
  // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.checkOptionAndContinue(commonContent, '#isAppointee-no');
  I.continueFromIndependance(commonContent);
  I.checkOptionAndContinue(commonContent, '#haveAMRN-no');
  I.checkOptionAndContinue(commonContent, '#haveContactedDWP-yes');
  I.enterReasonForNoMRNAndContinue(language, commonContent, testData.mrn.reasonForNoMRN);
  I.continueFromStillCanAppeal(language);
  I.enterAppellantNameAndContinue(language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(language, commonContent, appellant.nino);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(language, commonContent);
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, randomWeekDay);
  I.confirmDetailsArePresent(language, hasMRN);
}).retry(1);

Scenario(`${language.toUpperCase()} - Appellant has not contacted DWP and exits the service`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, testData.benefitType.code);
  // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
  I.enterPostcodeAndContinue(language, commonContent, appellant.contactDetails.postCode);
  I.checkOptionAndContinue(commonContent, '#isAppointee-no');
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(language, commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(language, commonContent, '#haveAMRN-no');
  I.checkOptionAndContinue(commonContent, '#haveContactedDWP-no');
  I.see(contactDWPContent.title);
  I.click(contactDWPContent.govuk);
  I.seeCurrentUrlEquals('https://www.gov.uk/');
}).retry(1);

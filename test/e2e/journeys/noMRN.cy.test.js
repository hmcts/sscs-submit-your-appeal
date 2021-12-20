const language = 'cy';
const commonContent = require('commonContent')[language];
const contactDWPContent = require(`steps/compliance/contact-dwp/content.${language}`);

const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data.en');
const moment = require('moment');
const paths = require('paths');
const config = require('config');

const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled') === 'true';

const appellant = testData.appellant;

Feature(`${language.toUpperCase()} - Appellant does not have a MRN @batch-04`);

Before(I => {
  I.createTheSession(language);
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - Appellant has contacted DWP @fullFunctional`, async I => {
  const randomWeekDay = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
  );

  const hasMRN = false;

  I.enterBenefitTypeAndContinue(commonContent, testData.benefitType.code);
  // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.checkOptionAndContinue(commonContent, '#isAppointee-no');
  I.continueFromIndependance(commonContent);
  I.checkOptionAndContinue(commonContent, '#haveAMRN-no');
  I.checkOptionAndContinue(commonContent, '#haveContactedDWP-yes');
  I.enterReasonForNoMRNAndContinue(commonContent, testData.mrn.reasonForNoMRN);
  I.continueFromStillCanAppeal(language);
  I.enterAppellantNameAndContinue(commonContent, appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(commonContent, appellant.nino);
  I.enterAppellantContactDetailsAndContinue(commonContent, language);
  I.selectDoYouWantToReceiveTextMessageReminders(commonContent, '#doYouWantTextMsgReminders-no');
  I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(commonContent, language, randomWeekDay);
  I.confirmDetailsArePresent(language, hasMRN);
}).retry(1);

Scenario(`${language.toUpperCase()} - Appellant has not contacted DWP and exits the service @fullFunctional`, I => {
  I.enterBenefitTypeAndContinue(commonContent, testData.benefitType.code);
  // I.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
  I.enterPostcodeAndContinue(commonContent, appellant.contactDetails.postCode);
  I.checkOptionAndContinue(commonContent, '#isAppointee-no');
  I.continueFromIndependance(commonContent);
  if (allowSaveAndReturnEnabled) {
    I.selectIfYouWantToCreateAccount(commonContent, '#createAccount-no');
  }
  I.selectHaveYouGotAMRNAndContinue(commonContent, '#haveAMRN-no');
  I.checkOptionAndContinue(commonContent, '#haveContactedDWP-no');
  I.see(contactDWPContent.title);
  I.click(contactDWPContent.govuk);
  I.seeCurrentUrlEquals('https://www.gov.uk/');
}).retry(1);

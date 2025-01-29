const { test, expect } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const contactDWPContent = require(`steps/compliance/contact-dwp/content.${language}`);

const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data.en');
const moment = require('moment');
const config = require('config');
const {
  checkOptionAndContinue
} = require('../page-objects/controls/option');
const { selectHaveYouGotAMRNAndContinue } = require('../page-objects/compliance/haveAMRN');
const { selectIfYouWantToCreateAccount } = require('../page-objects/idam/createAccount');
const { continueFromIndependance } = require('../page-objects/start/independence');
const { enterPostcodeAndContinue } = require('../page-objects/start/postcode-checker');
const { enterBenefitTypeAndContinue } = require('../page-objects/start/benefit-type');
const {
  confirmDetailsArePresent,
  enterDetailsFromAttendingTheHearingDatePickerToEnd,
  enterDetailsFromNoRepresentativeToUploadingEvidence
} = require('../page-objects/cya/checkYourAppeal');
const { selectDoYouWantToReceiveTextMessageReminders } = require('../page-objects/sms-notify/textReminders');
const {
  enterAppellantContactDetailsAndContinue,
  enterAppellantNINOAndContinue,
  enterAppellantDOBAndContinue,
  enterAppellantNameAndContinue
} = require('../page-objects/identity/appellantDetails');
const { continueFromStillCanAppeal } = require('../page-objects/compliance/stillCanAppeal');
const { enterReasonForNoMRNAndContinue } = require('../page-objects/compliance/noMRN');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');

const allowSaveAndReturnEnabled = config.get('features.allowSaveAndReturn.enabled').toString() === 'true';

const appellant = testData.appellant;

test.describe(`${language.toUpperCase()} - Appellant does not have a MRN`, { tag: '@batch-04' }, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Appellant has contacted DWP`, async({ page }) => {
    const randomWeekDay = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
    );

    const hasMRN = false;

    await enterBenefitTypeAndContinue(page, language, commonContent, testData.benefitType.code);
    await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
    await checkOptionAndContinue(page, commonContent, '#isAppointee-no');
    await continueFromIndependance(page, commonContent);
    await checkOptionAndContinue(page, commonContent, '#haveAMRN-no');
    await checkOptionAndContinue(page, commonContent, '#haveContactedDWP-yes');
    await enterReasonForNoMRNAndContinue(page, language, commonContent, testData.mrn.reasonForNoMRN);
    await continueFromStillCanAppeal(page, language);
    await enterAppellantNameAndContinue(page, language, commonContent, appellant.title, appellant.firstName, appellant.lastName);
    await enterAppellantDOBAndContinue(page, language, commonContent, appellant.dob.day, appellant.dob.month, appellant.dob.year);
    await enterAppellantNINOAndContinue(page, language, commonContent, appellant.nino);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, randomWeekDay);
    await confirmDetailsArePresent(page, language, hasMRN);
  });

  test(`${language.toUpperCase()} - Appellant has not contacted DWP and exits the service`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, testData.benefitType.code);
    // page.chooseLanguagePreference(commonContent, testData.languagePreferenceWelsh);
    await enterPostcodeAndContinue(page, language, commonContent, appellant.contactDetails.postCode);
    await checkOptionAndContinue(page, commonContent, '#isAppointee-no');
    await continueFromIndependance(page, commonContent);
    if (allowSaveAndReturnEnabled) {
      await selectIfYouWantToCreateAccount(page, language, commonContent, '#createAccount-no');
    }
    await selectHaveYouGotAMRNAndContinue(page, language, commonContent, '#haveAMRN-no');
    await checkOptionAndContinue(page, commonContent, '#haveContactedDWP-no');
    await expect(page.getByText(contactDWPContent.title).first()).toBeVisible();
    await page.getByText(contactDWPContent.govuk).first().click();
    await page.waitForURL('https://www.gov.uk/');
  });
});

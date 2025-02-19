const { test } = require('@playwright/test');

const language = 'en';
const commonContent = require('commonContent')[language];
const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data.en');
const {
  confirmDetailsArePresent,
  enterDetailsFromNoRepresentativeToEnd
} = require('../page-objects/cya/checkYourAppeal');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const {
  enterAppellantContactDetailsAndContinue,
  enterAppellantNINOAndContinue,
  enterAppellantDOBAndContinue,
  enterAppellantNameAndContinue
} = require('../page-objects/identity/appellantDetails');
const {
  enterReasonsForBeingLateAndContinue
} = require('../page-objects/compliance/mrnLate');
const {
  enterAnMRNDateAndContinue
} = require('../page-objects/compliance/mrnDate');
const {
  enterDWPIssuingOfficeAndContinue
} = require('../page-objects/compliance/dwpIssuingOffice');
const {
  continueFromIndependance
} = require('../page-objects/start/independence');
const {
  enterPostcodeAndContinue
} = require('../page-objects/start/postcode-checker');
const {
  enterBenefitTypeAndContinue
} = require('../page-objects/start/benefit-type');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');
const { skipPcq } = require('../page-objects/pcq/pcq');

const appellant = testData.appellant;

const oneMonthAndOneDayLate = {
  mrnDate: DateUtils.oneMonthAndOneDayAgo(language),
  label: 'one month late'
};
const thirteenMonthsAndOneDayLate = {
  mrnDate: DateUtils.thirteenMonthsAndOneDayAgo(language),
  label: 'thirteen months late'
};

test.describe(
  `${language.toUpperCase()} - Appellant has a dated MRN`,
  { tag: '@batch-03' },
  () => {
    test.beforeEach('Create session and user', async({ page }) => {
      await createTheSession(page, language);
    });

    test.afterEach('End session and delete user', async({ page }) => {
      await endTheSession(page);
    });

    [oneMonthAndOneDayLate, thirteenMonthsAndOneDayLate].forEach(obj => {
      test(`${language.toUpperCase()} - Appellant has a MRN that is over ${obj.label}`, async({
        page
      }) => {
        await enterBenefitTypeAndContinue(
          page,
          language,
          commonContent,
          testData.benefitType.code
        );
        await enterPostcodeAndContinue(
          page,
          language,
          commonContent,
          testData.appellant.contactDetails.postCode
        );
        await checkOptionAndContinue(page, commonContent, '#isAppointee-no');
        await continueFromIndependance(page, commonContent);
        await checkOptionAndContinue(page, commonContent, '#haveAMRN-yes');
        await enterDWPIssuingOfficeAndContinue(
          page,
          commonContent,
          testData.mrn.dwpIssuingOffice
        );
        await enterAnMRNDateAndContinue(page, commonContent, obj.mrnDate);
        await checkOptionAndContinue(page, commonContent, '#checkedMRN-yes');
        await enterReasonsForBeingLateAndContinue(
          page,
          commonContent,
          testData.mrn.reasonWhyMRNisLate
        );
        await enterAppellantNameAndContinue(
          page,
          language,
          commonContent,
          appellant.title,
          appellant.firstName,
          appellant.lastName
        );
        await enterAppellantDOBAndContinue(
          page,
          language,
          commonContent,
          appellant.dob.day,
          appellant.dob.month,
          appellant.dob.year
        );
        await enterAppellantNINOAndContinue(
          page,
          language,
          commonContent,
          appellant.nino
        );
        await enterAppellantContactDetailsAndContinue(
          page,
          commonContent,
          language
        );
        await checkOptionAndContinue(
          page,
          commonContent,
          '#doYouWantTextMsgReminders-no'
        );
        await enterDetailsFromNoRepresentativeToEnd(
          page,
          language,
          commonContent
        );
        await skipPcq(page);
        await confirmDetailsArePresent(page, language, true, obj.mrnDate);
      });
    });
  }
);

/* eslint-disable no-process-env */
const { test } = require('@playwright/test');

const language = 'cy';

const content = require('commonContent');
const testData = require(`test/e2e/data.${language}`);
const { createTheSession } = require('../page-objects/session/createSession');
const {
  enterDetailsFromStartToNINO,
  enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  checkYourAppealToConfirmationPage
} = require('../page-objects/cya/checkYourAppeal');
const { enterAppellantContactDetailsWithMobileAndContinue } = require('../page-objects/identity/appellantDetails');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const { readSMSConfirmationAndContinue } = require('../page-objects/sms-notify/smsConfirmation');
const { enterDoYouWantToAttendTheHearing } = require('../page-objects/hearing/theHearing');
const { selectTelephoneHearingOptionsAndContinue } = require('../page-objects/hearing/options');
const { selectDoYouNeedSupportAndContinue } = require('../page-objects/hearing/support');
const { selectHearingAvailabilityAndContinue } = require('../page-objects/hearing/availability');
const { skipPcqCY } = require('../page-objects/pcq/pcq');
const { endTheSession } = require('../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - PIP E2E SYA - Full Journey`, () => {
  test(`${language.toUpperCase()} - PIP E2E SYA Journey @functional @e2e`, async({ page }) => {
    const commonContent = content[language];

    await createTheSession(page, language);

    await page.waitForTimeout(2);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsWithMobileAndContinue(page, commonContent, language, '07411222222');
    await checkOptionAndContinue(page, commonContent, '#doYouWantTextMsgReminders-yes');
    await checkOptionAndContinue(page, commonContent, '#useSameNumber-yes');
    await readSMSConfirmationAndContinue(page, commonContent);
    await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
    await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
    await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
    await selectDoYouNeedSupportAndContinue(page, language, commonContent, '#arrangements-no');
    await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-no');
    await skipPcqCY(page);
    await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);

    await endTheSession(page);
  });
});

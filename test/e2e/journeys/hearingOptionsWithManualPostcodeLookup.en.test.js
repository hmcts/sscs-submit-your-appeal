/* eslint-disable no-process-env */

const { test } = require('@playwright/test');

const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const testData = require(`test/e2e/data.${language}`);
const { endTheSession } = require('../page-objects/session/endSession');
const {
  checkYourAppealToConfirmationPage,
  enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const { skipPcq } = require('../page-objects/pcq/pcq');
const { selectHearingAvailabilityAndContinue } = require('../page-objects/hearing/availability');
const { selectDoYouNeedSupportAndContinue } = require('../page-objects/hearing/support');
const { selectTelephoneHearingOptionsAndContinue } = require('../page-objects/hearing/options');
const { enterDoYouWantToAttendTheHearing } = require('../page-objects/hearing/theHearing');
const { checkOptionAndContinue } = require('../page-objects/controls/option');
const { enterAppellantContactDetailsManuallyAndContinue } = require('../page-objects/identity/appellantDetails');
const { createTheSession } = require('../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Hearing options test for type Telephone`, { tag: '@functional' }, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await page.waitForTimeout(1000);
    await createTheSession(page, language);
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Appellant enters telephone hearing option`, async({ page }) => {
    await page.goto(paths.session.root);
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsManuallyAndContinue(page, commonContent);
    await checkOptionAndContinue(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
    await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-yes');
    await selectTelephoneHearingOptionsAndContinue(page, language, commonContent);
    await selectDoYouNeedSupportAndContinue(page, language, commonContent, '#arrangements-no');
    await selectHearingAvailabilityAndContinue(page, language, commonContent, '#scheduleHearing-no');
    await skipPcq(page);
    await checkYourAppealToConfirmationPage(page, language, testData.signAndSubmit.signer);

    await endTheSession(page);
  });
});

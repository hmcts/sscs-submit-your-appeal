/* eslint-disable no-process-env */

const { test, expect } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');
const { enterDateCantAttendAndContinue } = require('../page-objects/hearing/datesCantAttend');
const {
  enterDetailsFromAttendingTheHearingToEnd,
  enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  enterDetailsFromStartToNINO,
  confirmDetailsArePresent,
  enterDetailsFromNoRepresentativeToUploadingEvidence
} = require('../page-objects/cya/checkYourAppeal');
const {
  selectDoYouWantToReceiveTextMessageReminders
} = require('../page-objects/sms-notify/textReminders');
const {
  enterAppellantContactDetailsAndContinue
} = require('../page-objects/identity/appellantDetails');
const { endTheSession } = require('../page-objects/session/endSession');
const { createTheSession } = require('../page-objects/session/createSession');
const { skipPcq } = require('../page-objects/pcq/pcq');


const datesYouCantAttend = selectors[language].theHearing.datesYouCantAttend;
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change}`;

// Deprecated functionality - replaced by date picker
test.describe(`DEPRECATED ${language.toUpperCase()} - PIP, one month ago, attends hearing with dates cannot attend`, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Provides date of when they cannot attend the hearing`, async({ page }) => {
    moment().locale(language);

    const randomWeekDay = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-2');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingToEnd(page, commonContent, language, randomWeekDay);
    await skipPcq(page);
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(DateUtils.formatDate(randomWeekDay, 'DD MMMM YYYY')).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Provides a date when they cannot attend the hearing then edits the date @local`, async({ page }) => {
    moment().locale(language);

    const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(8, 'weeks'));
    const randomWeekDayIn7Weeks = DateUtils.getRandomWeekDayFromDate(moment().add(13, 'weeks'));
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-2');
    await enterDetailsFromNoRepresentativeToNoUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingToEnd(page, commonContent, language, randomWeekDayIn5Weeks);
    await page.getByText(commonContent.continue).click();
    console.log(`language assigned is ${moment.locale()}`);
    console.log(`Generated date is ############# ${randomWeekDayIn5Weeks}`);
    await expect(page.getByText(DateUtils.formatDate(randomWeekDayIn5Weeks, 'DD MMMM YYYY')).first()).toBeVisible();

    // Now edit the single date from 10 to 11 weeks.
    await page.locator(datesYouCantAttendHearingChange).click();
    await page.waitForURL(paths.hearing.hearingAvailability);
    await page.getByText(commonContent.continue).click();
    await enterDateCantAttendAndContinue(page, commonContent, randomWeekDayIn7Weeks, commonContent.edit);
    await page.getByText(commonContent.continue).click();
    await expect(page.getByText(DateUtils.formatDate(randomWeekDayIn7Weeks, 'DD MMMM YYYY')).first()).toBeVisible();
  });
});

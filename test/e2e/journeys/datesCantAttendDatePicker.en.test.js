const language = 'en';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const datesYouCantAttend = selectors[language].theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend} ${selectors[language].answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change}`;

/* eslint-disable max-len */
const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { selectDates, deselectDates } = require('../page-objects/hearing/datesCantAttend');
const {
  enterDetailsFromAttendingTheHearingDatePickerToEnd,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromStartToNINO,
  confirmDetailsArePresent
} = require('../page-objects/cya/checkYourAppeal');
const { selectDoYouWantToReceiveTextMessageReminders } = require('../page-objects/sms-notify/textReminders');
const { enterAppellantContactDetailsAndContinue } = require('../page-objects/identity/appellantDetails');

test.describe(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with dates cannot attend using date-picker @batch-01`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Selects date of when they cannot attend the hearing`, async({ page }) => {
    moment().locale(language);

    const randomWeekDay = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(9, 'weeks')));
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, randomWeekDay);
    await confirmDetailsArePresent(page, language);
    await expect(page.locator('DD MMMM YYYY').first(), datesYouCantAttendHearingAnswer).toHaveText(DateUtils.formatDate(moment(randomWeekDay)));
  });

  test(`${language.toUpperCase()} - Selects a date when they cannot attend the hearing, then edits the date`, async({ page }) => {
    moment().locale(language);

    const randomWeekDayIn8Weeks = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(8, 'weeks')));
    const randomWeekDayIn10Weeks = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(10, 'weeks')));

    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, randomWeekDayIn8Weeks);
    await expect(page.locator('DD MMMM YYYY').first(), datesYouCantAttendHearingAnswer).toHaveText(DateUtils.formatDate(moment(randomWeekDayIn8Weeks)));

    // Now edit the single date from 5 to 6 weeks.
    await page.getByText(datesYouCantAttendHearingChange).first().click();
    await page.waitForURL(`**/${paths.hearing.hearingAvailability}`);
    await page.getByText(commonContent.continue).first().click();
    await deselectDates(page, language, [randomWeekDayIn8Weeks]);
    await page.waitForTimeout(1000);
    await selectDates(page, language, [randomWeekDayIn10Weeks]);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.locator('DD MMMM YYYY').first(), datesYouCantAttendHearingAnswer).toHaveText(DateUtils.formatDate(moment(randomWeekDayIn10Weeks)));
  });
});

const { test, expect } = require('@playwright/test');

const language = 'cy';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');
const { selectDates, deselectDates } = require('../page-objects/hearing/datesCantAttend');
const {
  enterDetailsFromAttendingTheHearingDatePickerToEnd,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromStartToNINO,
  confirmDetailsArePresent
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
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change} > a`;

/* eslint-disable max-len */
test.describe(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with dates cannot attend using date-picker`, { tag: '@batch-01' }, () => {
  test.beforeEach('Create session and user', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session and delete user', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Selects date of when they cannot attend the hearing`, async({ page }) => {
    moment().locale(language);

    const randomWeekDay = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(10, 'weeks'))
    );
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-2');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, randomWeekDay);
    await skipPcq(page);
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(DateUtils.formatDate(moment(randomWeekDay), 'DD MMMM YYYY')).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Selects a date when they cannot attend the hearing, then edits the date`, async({ page }) => {
    moment().locale(language);

    const randomWeekDayIn9Weeks = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(9, 'weeks'))
    );
    const randomWeekDayIn11Weeks = DateUtils.getDateInMilliseconds(
      DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(11, 'weeks'))
    );

    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-2');
    await enterDetailsFromNoRepresentativeToUploadingEvidence(page, language, commonContent);
    await enterDetailsFromAttendingTheHearingDatePickerToEnd(page, commonContent, language, randomWeekDayIn9Weeks);
    await skipPcq(page);
    await expect(page.getByText(DateUtils.formatDate(moment(randomWeekDayIn9Weeks), 'DD MMMM YYYY')).first()).toBeVisible();

    // Now edit the single date from 5 to 6 weeks.
    await page.locator(datesYouCantAttendHearingChange).first().click();
    await page.waitForURL(paths.hearing.hearingAvailability);
    await page.getByText(commonContent.continue).first().click();
    await deselectDates(page, language, [randomWeekDayIn9Weeks]);
    await selectDates(page, language, [randomWeekDayIn11Weeks]);
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(DateUtils.formatDate(moment(randomWeekDayIn11Weeks), 'DD MMMM YYYY')).first()).toBeVisible();
  });
});

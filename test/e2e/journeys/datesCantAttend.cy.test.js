/* eslint-disable no-process-env */

const language = 'cy';
const commonContent = require('commonContent')[language];
const selectors = require('steps/check-your-appeal/selectors');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const paths = require('paths');

const datesYouCantAttend = selectors[language].theHearing.datesYouCantAttend;
const datesYouCantAttendHearingAnswer = `${datesYouCantAttend} ${selectors[language].answer}`;
const datesYouCantAttendHearingChange = `${datesYouCantAttend} ${selectors[language].change}`;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const {
  enterDateCantAttendAndContinue
} = require('../page-objects/hearing/datesCantAttend');
const {
  enterDetailsFromAttendingTheHearingToEnd,
  enterDetailsFromNoRepresentativeToNoUploadingEvidence,
  confirmDetailsArePresent,
  enterDetailsFromNoRepresentativeToUploadingEvidence,
  enterDetailsFromStartToNINO
} = require('../page-objects/cya/checkYourAppeal');
const {
  selectDoYouWantToReceiveTextMessageReminders
} = require('../page-objects/sms-notify/textReminders');
const {
  enterAppellantContactDetailsAndContinue
} = require('../page-objects/identity/appellantDetails');

test.describe(`${language.toUpperCase()} - PIP, one month ago, attends hearing with dates cannot attend`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Provides date of when they cannot attend the hearing`, async({
    page
  }) => {
    moment().locale(language);

    const randomWeekDay = DateUtils.getRandomWeekDayFromDate(
      moment().add(5, 'weeks')
    );
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(
      page,
      commonContent,
      language
    );
    await selectDoYouWantToReceiveTextMessageReminders(
      page,
      commonContent,
      '#doYouWantTextMsgReminders-no'
    );
    await enterDetailsFromNoRepresentativeToUploadingEvidence(
      page,
      language,
      commonContent
    );
    await enterDetailsFromAttendingTheHearingToEnd(
      page,
      commonContent,
      language,
      randomWeekDay
    );
    await confirmDetailsArePresent(page, language);
    await expect(
      page.locator('DD MMMM YYYY').first(),
      datesYouCantAttendHearingAnswer
    ).toHaveText(DateUtils.formatDate(randomWeekDay));
  });

  test(`${language.toUpperCase()} - Provides a date when they cannot attend the hearing then edits the date @local`, async({
    page
  }) => {
    moment().locale(language);

    const randomWeekDayIn5Weeks = DateUtils.getRandomWeekDayFromDate(
      moment().add(8, 'weeks')
    );
    const randomWeekDayIn7Weeks = DateUtils.getRandomWeekDayFromDate(
      moment().add(13, 'weeks')
    );
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(
      page,
      commonContent,
      language
    );
    await selectDoYouWantToReceiveTextMessageReminders(
      page,
      commonContent,
      '#doYouWantTextMsgReminders-no'
    );
    await enterDetailsFromNoRepresentativeToNoUploadingEvidence(
      page,
      language,
      commonContent
    );
    await enterDetailsFromAttendingTheHearingToEnd(
      page,
      commonContent,
      language,
      randomWeekDayIn5Weeks
    );
    await page.waitForTimeout(5000);
    await page.click(commonContent.continue);
    await page.waitForTimeout(1000);
    console.log(`language assigned is ${moment.locale()}`);
    console.log(`Generated date is ############# ${randomWeekDayIn5Weeks}`);
    await expect(
      page.locator('DD MMMM YYYY').first(),
      datesYouCantAttendHearingAnswer
    ).toHaveText(DateUtils.formatDate(randomWeekDayIn5Weeks));

    // Now edit the single date from 10 to 11 weeks.
    await page.click(datesYouCantAttendHearingChange);
    await page.waitForURL(`**/${paths.hearing.hearingAvailability}`);
    await page.click(commonContent.continue);
    await enterDateCantAttendAndContinue(
      page,
      commonContent,
      randomWeekDayIn7Weeks,
      commonContent.edit
    );
    await page.click(commonContent.continue);
    await page.waitForTimeout(1000);
    await expect(
      page.locator('DD MMMM YYYY').first(),
      datesYouCantAttendHearingAnswer
    ).toHaveText(DateUtils.formatDate(randomWeekDayIn7Weeks));
  });
});

const language = 'en';
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const dateFiveWeeksFromNow = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks')));
const dateSixWeeksFromNow = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(6, 'weeks')));
const dateSevenWeeksFromNow = DateUtils.getDateInMilliseconds(DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(7, 'weeks')));

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { doesntHaveSelectedClass, dontSeeFormattedDate, selectDates, deselectDates } = require('../../page-objects/hearing/datesCantAttend');

test.describe(`${language.toUpperCase()} - Dates can't attend date picker @batch-08`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.hearing.datesCantAttend);
    await page.locator('#date-picker table').first().waitFor({ timeout: 10000 });
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to the page, I see the date-picker`, async({ page }) => {
    await expect(page.locator('#date-picker table').first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I select a date, it is highlighted and date is shown in the table`, async({ page }) => {
    await selectDates(page, language, [dateFiveWeeksFromNow]);
  });

  test(`${language.toUpperCase()} - When I select and deselect a date, it isn't highlighted and not shown in the table`, async({ page }) => {
    await selectDates(page, language, [dateFiveWeeksFromNow]);
    await deselectDates(page, language, [dateFiveWeeksFromNow]);
  });

  test(`${language.toUpperCase()} - When I select multiple dates, I see them in the table`, async({ page }) => {
    await selectDates(page, language, [dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
  });

  test(`${language.toUpperCase()} - When I select multiple dates and them deselect them, I don't see them in the table`, async({ page }) => {
    await selectDates(page, language, [dateFiveWeeksFromNow, dateSixWeeksFromNow]);
    await deselectDates(page, language, [dateFiveWeeksFromNow, dateSixWeeksFromNow]);
  });

  test(`${language.toUpperCase()} - When I select a date and then click remove, the date is removed and deselected`, async({ page }) => {
    await selectDates(page, language, [dateFiveWeeksFromNow]);
    await page.getByText('Remove').first().click();
    await dontSeeFormattedDate(page, moment(dateFiveWeeksFromNow));
  });

  test(`${language.toUpperCase()} - When I select a disabled date, I don't see it in the table`, async({ page }) => {
    const date = DateUtils.getDateInMilliseconds(moment().utc().add(5, 'weeks').day(0).startOf('day'));
    const element = `//*[@data-date="${date}"]`;
    await page.getByText(element).first().click();
    await dontSeeFormattedDate(page, moment(date));
    await doesntHaveSelectedClass(page, element);
  });
});

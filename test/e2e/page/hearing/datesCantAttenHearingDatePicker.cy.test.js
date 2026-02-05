const language = 'cy';
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const dateFiveWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(
    moment().utc().startOf('day').add(5, 'weeks')
  )
);
const dateSixWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(
    moment().utc().startOf('day').add(6, 'weeks')
  )
);
const dateSevenWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(
    moment().utc().startOf('day').add(7, 'weeks')
  )
);

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  dontSeeFormattedDate
} = require('../../page-objects/hearing/datesCantAttend');

test.describe(
  `${language.toUpperCase()} - Dates can't attend date picker`,
  { tag: '@batch-08' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.hearing.datesCantAttend);
      page.waitForElement('#date-picker table', 10);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page go to the page, page see the date-picker`, async ({
      page
    }) => {
      await expect(page.locator('#date-picker table').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page select a date, it is highlighted and date is shown in the table`, async ({
      page
    }) => {
      await page.selectDates(language, [dateFiveWeeksFromNow]);
    });

    test(`${language.toUpperCase()} - When page select and deselect a date, it isn't highlighted and not shown in the table`, async ({
      page
    }) => {
      await page.selectDates(language, [dateFiveWeeksFromNow]);
      await page.deselectDates(language, [dateFiveWeeksFromNow]);
    });

    test(`${language.toUpperCase()} - When page select multiple dates, page see them in the table`, async ({
      page
    }) => {
      await page.selectDates(language, [
        dateFiveWeeksFromNow,
        dateSixWeeksFromNow,
        dateSevenWeeksFromNow
      ]);
    });

    test(`${language.toUpperCase()} - When page select multiple dates and them deselect them, page don't see them in the table`, async ({
      page
    }) => {
      await page.selectDates(language, [
        dateFiveWeeksFromNow,
        dateSixWeeksFromNow
      ]);
      await page.deselectDates(language, [
        dateFiveWeeksFromNow,
        dateSixWeeksFromNow
      ]);
    });

    test(`${language.toUpperCase()} - When page select a date and then click remove, the date is removed and deselected`, async ({
      page
    }) => {
      await page.selectDates(language, [dateFiveWeeksFromNow]);
      await page.getByText('Remove').first().click();
      await dontSeeFormattedDate(page, moment(dateFiveWeeksFromNow));
    });

    test(`${language.toUpperCase()} - When page select a disabled date, page don't see it in the table`, async ({
      page
    }) => {
      const date = DateUtils.getDateInMilliseconds(
        moment().utc().add(5, 'weeks').day(0).startOf('day')
      );
      const element = `//*[@data-date="${date}"]`;
      await page.getByText(element).first().click();
      await dontSeeFormattedDate(page, moment(date));
      await page.doesntHaveSelectedClass(element);
    });
  }
);

const language = 'cy';
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const dateFiveWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
);
const dateSixWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(6, 'weeks'))
);
const dateSevenWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(7, 'weeks'))
);

Feature(`${language.toUpperCase()} - Dates can't attend date picker @batch-08`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.hearing.datesCantAttend);
  I.waitForElement('#date-picker table', 10);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I go to the page, I see the date-picker`, ({ I }) => {
  I.seeElement('#date-picker table');
});

Scenario(`${language.toUpperCase()} - When I select a date, it is highlighted and date is shown in the table`, async({ I }) => {
  await I.selectDates(language, [dateFiveWeeksFromNow]);
});

Scenario(`${language.toUpperCase()} - When I select and deselect a date, it isn't highlighted and not shown in the table`,
  async({ I }) => {
    await I.selectDates(language, [dateFiveWeeksFromNow]);
    await I.deselectDates(language, [dateFiveWeeksFromNow]);
  });

Scenario(`${language.toUpperCase()} - When I select multiple dates, I see them in the table`, async({ I }) => {
  await I.selectDates(language, [dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
}).retry(2);

Scenario(`${language.toUpperCase()} - When I select multiple dates and them deselect them, I don't see them in the table`,
  async({ I }) => {
    await I.selectDates(language, [dateFiveWeeksFromNow, dateSixWeeksFromNow]);
    await I.deselectDates(language, [dateFiveWeeksFromNow, dateSixWeeksFromNow]);
  }).retry(2);

Scenario(`${language.toUpperCase()} - When I select a date and then click remove, the date is removed and deselected`,
  async({ I }) => {
    await I.selectDates(language, [dateFiveWeeksFromNow]);
    I.click('Remove');
    I.dontSeeFormattedDate(moment(dateFiveWeeksFromNow));
  });

Scenario(`${language.toUpperCase()} - When I select a disabled date, I don't see it in the table`, async({ I }) => {
  const date = DateUtils.getDateInMilliseconds(
    moment().utc().add(5, 'weeks').day(0).startOf('day')
  );
  const element = `//*[@data-date="${date}"]`;
  I.click(element);
  I.dontSeeFormattedDate(moment(date));
  await I.doesntHaveSelectedClass(element);
});

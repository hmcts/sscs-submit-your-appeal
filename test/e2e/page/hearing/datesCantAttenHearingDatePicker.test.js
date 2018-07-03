const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

const dateFiveWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(5, 'weeks'))
);
const dateSixWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(6, 'weeks'))
);
const dateSevenWeeksFromNow = DateUtils.getDateInMilliseconds(
  DateUtils.getRandomWeekDayFromDate(moment().utc().startOf('day').add(7, 'weeks'))
);

Feature('Dates can\'t attend date picker');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.hearing.datesCantAttend);
  I.waitForElement('#date-picker table', 10);
});

After(I => {
  I.endTheSession();
});

Scenario('When I go to the page, I see the date-picker', I => {
  I.seeElement('#date-picker table');
});

Scenario('When I select a date, it is highlighted and date is shown in the table', async I => {
  await I.selectDates([dateFiveWeeksFromNow]);
});

Scenario('When I select and deselect a date, it isn\'t highlighted and not shown in the table',
  async I => {
    await I.selectDates([dateFiveWeeksFromNow]);
    await I.deselectDates([dateFiveWeeksFromNow]);
  });

Scenario('When I select multiple dates, I see them in the table', async I => {
  await I.selectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
}).retry(2);

Scenario('When I select multiple dates and them deselect them, I don\'t see them in the table',
  async I => {
    await I.selectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow]);
    await I.deselectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow]);
  }).retry(2);

Scenario('When I select a date and then click remove, the date is removed and deselected',
  async I => {
    await I.selectDates([dateFiveWeeksFromNow]);
    I.click('Remove');
    I.dontSeeFormattedDate(moment(dateFiveWeeksFromNow));
  });

Scenario('When I select a disabled date, I don\'t see it in the table', async I => {
  const date = DateUtils.getDateInMilliseconds(
    moment().utc().add(5, 'weeks').day(0).startOf('day')
  );
  const element = `//*[@data-date="${date}"]`;
  I.click(element);
  I.dontSeeFormattedDate(moment(date));
  await I.doesntHaveSelectedClass(element);
});

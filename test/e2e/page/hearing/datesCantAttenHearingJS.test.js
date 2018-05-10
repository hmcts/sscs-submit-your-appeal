const paths = require('paths');
const moment = require('moment');
const timestamp = mDate => mDate.add(1, 'hour').valueOf();
const DateUtils = require('utils/DateUtils');
const dateFiveWeeksFromNow = timestamp(DateUtils.getRandomWeekDayFromDate(moment().startOf('day').add(5, 'weeks')));
const dateSixWeeksFromNow = timestamp(DateUtils.getRandomWeekDayFromDate(moment().startOf('day').add(6, 'weeks')));
const dateSevenWeeksFromNow = timestamp(DateUtils.getRandomWeekDayFromDate(moment().startOf('day').add(7, 'weeks')));

Feature('Dates can\'t attend JS version');

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

Scenario('When I select a date, it is highlighted and date is shown in the table', function*(I) {
  yield * I.selectDates([dateFiveWeeksFromNow]);
});

Scenario('When I select a date and deselect it, it isn\'t highlighted and not shown in the table', function*(I) {
  yield * I.selectDates([dateFiveWeeksFromNow]);
  yield * I.deselectDates([dateFiveWeeksFromNow]);
});

Scenario('When I select multiple dates, I see them in the table', function*(I) {
  yield * I.selectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
});

Scenario('When I select multiple dates and them deselect them, I don\'t see them in the table', function*(I) {
  yield * I.selectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
  yield * I.deselectDates([dateFiveWeeksFromNow, dateSixWeeksFromNow, dateSevenWeeksFromNow]);
});

Scenario('When I select a date and then click remove on the table, the date is removed and deselected', function*(I) {
  yield * I.selectDates([dateFiveWeeksFromNow]);
  I.click('Remove');
  I.dontSeeFormattedDate(moment(dateFiveWeeksFromNow));
});

Scenario('When I select a disabled date, I don\'t see it in the table', function*(I) {
  const date = timestamp(moment().add(5, 'weeks').day(0).startOf('day'));
  const element = `//*[@data-date="${date}"]`;
  I.click(element);
  I.dontSeeFormattedDate(moment(date));
  yield * I.doesntHaveSelectedClass(element);
});

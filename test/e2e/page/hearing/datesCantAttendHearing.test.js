const content = require('steps/hearing/dates-cant-attend/content.en');
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

const validDate = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
const additionalValidDate = DateUtils.getRandomWeekDayFromDate(moment().add(10, 'weeks'));

Feature('Dates can\'t attend');

Before(async I => {
  await I.createSessionWithJsOff();
  await I.goToPage(paths.hearing.datesCantAttend);
});

After(async I => {
  await I.endTheSessionWithJsOff();
});

Scenario('When I go to the page and there are no dates I see the Add date link', I => {
  I.see(content.noDates);
  I.see(content.links.add);
});

Scenario('When I click the Add date link, I go to the page where I can enter dates', I => {
  I.see(content.noDates);
  I.click(content.links.add);
  I.see(content.fields.cantAttendDate.legend);
  I.seeElement('.form-group-day input');
  I.seeElement('.form-group-month input');
  I.seeElement('.form-group-year input');
});

Scenario('When I add a date I see the date in the list', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  I.seeFormattedDate(validDate);
});

Scenario('When I add a date I see the add another date link', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  I.seeFormattedDate(validDate);
});

Scenario('When I add multiple dates, I see them in the list', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  await I.enterDateCantAttendWithoutJs(additionalValidDate, '.add-another-add-link');
  I.seeFormattedDate(validDate);
  I.seeFormattedDate(additionalValidDate);
});

Scenario('When I add a date and click the delete link, the date is removed', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  I.seeFormattedDate(validDate);
  I.click('Delete');
  I.dontSeeFormattedDate(validDate);
});

Scenario('I add a single date, I remove it, I see Add date', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  I.see(content.links.addAnother);
  I.click('Delete');
  I.dontSee(content.links.addAnother);
  I.see(content.links.add);
});

Scenario('When I click Continue without add a date, I see errors', I => {
  I.click('Continue');
  I.see(content.noDates);
});

Scenario('When I add a date and the edit it, I see the new date', async I => {
  await I.enterDateCantAttendWithoutJs(validDate, '.add-another-add-link');
  I.seeFormattedDate(validDate);
  await I.enterDateCantAttendWithoutJs(additionalValidDate, '.add-another-edit-link');
  I.dontSeeFormattedDate(validDate);
  I.seeFormattedDate(additionalValidDate);
});

Scenario('When I click Continue without filling in the date fields, I see errors', I => {
  I.click(content.links.add);
  I.click('Continue');
  I.see(content.fields.cantAttendDate.error.allRequired);
});

Scenario('When I click Continue when only entering the day field, I see errors', async I => {
  I.click(content.links.add);
  await I.enterValueInField('.form-group-day input', validDate.date());
  I.click('Continue');
  I.see(content.fields.cantAttendDate.error.monthRequired);
  I.see(content.fields.cantAttendDate.error.yearRequired);
});

Scenario('When I click Continue when only entering the month field, I see errors', async I => {
  I.click(content.links.add);
  await I.enterValueInField('.form-group-month input', validDate.month() + 1);
  I.click('Continue');
  I.see(content.fields.cantAttendDate.error.dayRequired);
  I.see(content.fields.cantAttendDate.error.yearRequired);
});

Scenario('When I click Continue when only entering the year field, I see errors', async I => {
  I.click(content.links.add);
  await I.enterValueInField('.form-group-year input', validDate.year());
  I.click('Continue');
  I.see(content.fields.cantAttendDate.error.dayRequired);
  I.see(content.fields.cantAttendDate.error.monthRequired);
});

Scenario('When I enter a date that is under four weeks from now, I see errors', async I => {
  const dateUnderFourWeeks = moment();
  await I.enterDateCantAttendWithoutJs(dateUnderFourWeeks, '.add-another-add-link');
  I.see(content.fields.cantAttendDate.error.underFourWeeks);
});

Scenario('When I enter a date that is over twenty two weeks from now, I see errors', async I => {
  const dateOverTwentyTwoWeeks = moment().add(23, 'weeks');
  await I.enterDateCantAttendWithoutJs(dateOverTwentyTwoWeeks, '.add-another-add-link');
  I.see(content.fields.cantAttendDate.error.overTwentyTwoWeeks);
});

Scenario('I enter a date I cant attend with the long name of month', async I => {
  const month = validDate.format('MMMM');
  I.click(content.links.add);
  await I.enterValueInField('.form-group-day input', validDate.date());
  await I.enterValueInField('.form-group-month input', month);
  await I.enterValueInField('.form-group-year input', validDate.year());
  I.click('Continue');
  I.click('Continue');
});

Scenario('I enter a date I cant attend with the short name of month', async I => {
  const month = validDate.format('MMM');
  I.click(content.links.add);
  await I.enterValueInField('.form-group-day input', validDate.date());
  await I.enterValueInField('.form-group-month input', month);
  await I.enterValueInField('.form-group-year input', validDate.year());
  I.click('Continue');
  I.click('Continue');
});

Scenario('I enter a date I cant attend with an invalid name of month', async I => {
  I.click(content.links.add);
  await I.enterValueInField('.form-group-day input', validDate.date());
  await I.enterValueInField('.form-group-month input', 'invalidMonth');
  await I.enterValueInField('.form-group-year input', validDate.year());
  I.click('Continue');
  I.see(content.fields.cantAttendDate.error.invalid);
});

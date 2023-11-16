const language = 'en';
const commonContent = require('commonContent')[language];
const datesCantAttendContent = require(`steps/hearing/dates-cant-attend/content.${language}`);
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const validDate = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
const additionalValidDate = DateUtils.getRandomWeekDayFromDate(moment().add(10, 'weeks'));

Feature(`${language.toUpperCase()} - Dates can't attend @batch-08`);

Before(async({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.hearing.datesCantAttend);
  await I.turnOffJsAndReloadThePage();
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I go to the page and there are no dates I see the Add date link`, ({ I }) => {
  I.see(datesCantAttendContent.noDates);
  I.see(datesCantAttendContent.links.add);
});

Scenario(`${language.toUpperCase()} - When I click the Add date link, I go to the page where I can enter dates`, ({ I }) => {
  I.see(datesCantAttendContent.noDates);
  I.click(datesCantAttendContent.links.add);
  I.see(datesCantAttendContent.fields.cantAttendDate.legend);
  I.seeElement('input[name*="day"]');
  I.seeElement('input[name*="month"]');
  I.seeElement('input[name*="year"]');
});

Scenario(`${language.toUpperCase()} - When I add a date I see the date in the list`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.seeFormattedDate(validDate);
});

Scenario(`${language.toUpperCase()} - When I add a date I see the add another date link`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.see(datesCantAttendContent.links.addAnother);
});

Scenario(`${language.toUpperCase()} - When I add multiple dates, I see them in the list`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.enterDateCantAttendAndContinue(commonContent, additionalValidDate, datesCantAttendContent.links.addAnother);
  I.seeFormattedDate(validDate);
  I.seeFormattedDate(additionalValidDate);
});

Scenario(`${language.toUpperCase()} - When I add a date and click the delete link, the date is removed`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.seeFormattedDate(validDate);
  I.click(commonContent.delete);
  I.dontSeeFormattedDate(validDate);
});

Scenario(`${language.toUpperCase()} - I add a single date, I remove it, I see Add date`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.see(datesCantAttendContent.links.addAnother);
  I.click(commonContent.delete);
  I.dontSee(datesCantAttendContent.links.addAnother);
  I.see(datesCantAttendContent.links.add);
});

Scenario(`${language.toUpperCase()} - When I click Continue without add a date, I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(datesCantAttendContent.noDates);
});

Scenario(`${language.toUpperCase()} - When I add a date and the edit it, I see the new date`, ({ I }) => {
  I.enterDateCantAttendAndContinue(commonContent, validDate, datesCantAttendContent.links.add);
  I.seeFormattedDate(validDate);
  I.enterDateCantAttendAndContinue(commonContent, additionalValidDate, commonContent.edit);
  I.dontSeeFormattedDate(validDate);
  I.seeFormattedDate(additionalValidDate);
});

Scenario(`${language.toUpperCase()} - When I click Continue without filling in the date fields, I see errors`, ({ I }) => {
  I.click(datesCantAttendContent.links.add);
  I.click(commonContent.continue);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.allRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the day field, I see errors`, ({ I }) => {
  I.click(datesCantAttendContent.links.add);
  I.fillField('input[name*="day"]', validDate.date().toString());
  I.click(commonContent.continue);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.monthRequired);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.yearRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the month field, I see errors`, ({ I }) => {
  I.click(datesCantAttendContent.links.add);
  I.fillField('input[name*="month"]', (validDate.month() + 1).toString());
  I.click(commonContent.continue);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.dayRequired);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.yearRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the year field, I see errors`, ({ I }) => {
  I.click(datesCantAttendContent.links.add);
  I.fillField('input[name*="year"]', validDate.year().toString());
  I.click(commonContent.continue);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.dayRequired);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.monthRequired);
});

Scenario(`${language.toUpperCase()} - When I enter a date that is under four weeks from now, I see errors`, ({ I }) => {
  const dateUnderFourWeeks = moment();
  I.enterDateCantAttendAndContinue(commonContent, dateUnderFourWeeks, datesCantAttendContent.links.add);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.underFourWeeks);
});

Scenario(`${language.toUpperCase()} - When I enter a date that is over twenty two weeks from now, I see errors`, ({ I }) => {
  const dateOverTwentyTwoWeeks = moment().add(23, 'weeks');
  I.enterDateCantAttendAndContinue(commonContent, dateOverTwentyTwoWeeks, datesCantAttendContent.links.add);
  I.see(datesCantAttendContent.fields.cantAttendDate.error.overTwentyTwoWeeks);
});

Scenario(`${language.toUpperCase()} - I enter a date I cant attend with the long name of month`, ({ I }) => {
  const month = DateUtils.formatDate(validDate, 'MMMM');
  I.click(datesCantAttendContent.links.add);
  I.enterADateAndContinue(validDate.date().toString(), month, validDate.year().toString());
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.checkYourAppeal);
});

Scenario(`${language.toUpperCase()} - I enter a date I cant attend with the short name of month`, ({ I }) => {
  const month = DateUtils.formatDate(validDate, 'MMM');
  I.click(datesCantAttendContent.links.add);
  I.enterADateAndContinue(validDate.date().toString(), month, validDate.year().toString());
  I.click(commonContent.continue);
  I.seeCurrentUrlEquals(paths.checkYourAppeal);
});

Scenario(`${language.toUpperCase()} - I enter a date I cant attend with an invalid name of month`, ({ I }) => {
  I.click(datesCantAttendContent.links.add);
  I.enterADateAndContinue(validDate.date().toString(), 'invalidMonth', validDate.year().toString());
  I.see(datesCantAttendContent.fields.cantAttendDate.error.invalid);
});

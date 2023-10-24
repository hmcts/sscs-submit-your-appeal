const language = 'en';
const commonContent = require('commonContent')[language];
const mrnDateContent = require(`steps/compliance/mrn-date/content.${language}`);
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const dateOnImage = require('steps/compliance/mrn-date/mrnDateOnImage');
const moment = require('moment');

const date = {
  day: '20',
  year: '2016'
};

Feature(`${language.toUpperCase()} - User has an MRN @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.mrnDate);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I have an MRN dated one day short of a month ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneDayShortOfAMonthAgo());
  I.seeCurrentUrlEquals(paths.identity.enterAppellantName);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated as the current date`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, moment());
  I.seeCurrentUrlEquals(paths.identity.enterAppellantName);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated one month ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneMonthAgo());
  I.seeCurrentUrlEquals(paths.identity.enterAppellantName);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated one month and one day ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneMonthAndOneDayAgo());
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated one day short of 13 months ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.oneDayShortOfThirteenMonthsAgo());
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated 13 months ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.thirteenMonthsAgo());
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I have an MRN dated 13 months and one day ago`, ({ I }) => {
  I.enterAnMRNDateAndContinue(commonContent, DateUtils.thirteenMonthsAndOneDayAgo());
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I have a MRN but I do not enter the day, month or the year`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(mrnDateContent.fields.date.error.allRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the day field I see errors`, ({ I }) => {
  I.fillField('input[name*="day"]', '21');
  I.click(commonContent.continue);
  I.see(mrnDateContent.fields.date.error.monthRequired);
  I.see(mrnDateContent.fields.date.error.yearRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the month field I see errors`, ({ I }) => {
  I.fillField('input[name*="month"]', '12');
  I.click(commonContent.continue);
  I.see(mrnDateContent.fields.date.error.yearRequired);
  I.see(mrnDateContent.fields.date.error.dayRequired);
});

Scenario(`${language.toUpperCase()} - When I click Continue when only entering the year field I see errors`, ({ I }) => {
  I.fillField('input[name*="year"]', '1999');
  I.click(commonContent.continue);
  I.see(mrnDateContent.fields.date.error.monthRequired);
  I.see(mrnDateContent.fields.date.error.dayRequired);
});

Scenario(`${language.toUpperCase()} - When I enter an invalid date I see errors`, ({ I }) => {
  I.enterADateAndContinue(commonContent, '30', '02', '1981');
  I.see(mrnDateContent.fields.date.error.invalid);
});

Scenario(`${language.toUpperCase()} - When I enter a date in the future I see errors`, ({ I }) => {
  I.enterADateAndContinue(commonContent, '25', '02', '3400');
  I.see(mrnDateContent.fields.date.error.future);
});

Scenario(`${language.toUpperCase()} - When I enter a date that is the same as the date on the image I see errors`, ({ I }) => {
  I.enterADateAndContinue(commonContent, dateOnImage.day, dateOnImage.month, dateOnImage.year);
  I.see(mrnDateContent.fields.date.error.dateSameAsImage);
});

Scenario(`${language.toUpperCase()} - I enter a MRN date with name of month`, ({ I }) => {
  date.month = 'ocToBer';
  I.enterADateAndContinue(commonContent, date.day, date.month, date.year);
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I enter a MRN date with the short name of month`, ({ I }) => {
  date.month = 'aUg';
  I.enterADateAndContinue(commonContent, date.day, date.month, date.year);
  I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
});

Scenario(`${language.toUpperCase()} - I enter a MRN date with an invalid name of month`, ({ I }) => {
  date.month = 'invalidMonth';
  I.enterADateAndContinue(commonContent, date.day, date.month, date.year);
  I.see(mrnDateContent.fields.date.error.invalid);
});

Scenario(`${language.toUpperCase()} - I have a csrf token`, ({ I }) => {
  I.seeElementInDOM('form input[name="_csrf"]');
});

const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const mrnDateFields = require('steps/compliance/mrn-date/content.en').fields;
const dateOnImage = require('steps/compliance/mrn-date/mrnDateOnImage');

Feature('User has an MRN');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.compliance.mrnDate);
});

After((I) => {
    I.endTheSession();
});

Scenario('I have an MRN dated one day short of a month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfAMonthAgo());
    I.seeCurrentUrlEquals(paths.identity.enterAppellantName);

});

Scenario('I have an MRN dated one month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAgo());
    I.seeCurrentUrlEquals(paths.identity.enterAppellantName);

});

Scenario('I have an MRN dated one month and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);

});

Scenario('I have an MRN dated one day short of 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfThirteenMonthsAgo());
    I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);

});

Scenario('I have an MRN dated 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAgo());
    I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);

});

Scenario('I have an MRN dated 13 months and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals(paths.compliance.checkMRNDate);

});

Scenario('I have a MRN but I do not enter the day, month or the year', (I) => {

    I.click('Continue');
    I.see(mrnDateFields.date.error.allRequired);

});

Scenario('When I click Continue when only entering the day field I see errors', (I) => {

    I.fillField('.form-group-day input', '21');
    I.click('Continue');
    I.see(mrnDateFields.date.error.monthRequired);
    I.see(mrnDateFields.date.error.yearRequired);

});

Scenario('When I click Continue when only entering the month field I see errors', (I) => {

    I.fillField('.form-group-month input', '12');
    I.click('Continue');
    I.see(mrnDateFields.date.error.yearRequired);
    I.see(mrnDateFields.date.error.dayRequired);

});

Scenario('When I click Continue when only entering the year field I see errors', (I) => {

    I.fillField('.form-group-year input', '1999');
    I.click('Continue');
    I.see(mrnDateFields.date.error.monthRequired);
    I.see(mrnDateFields.date.error.dayRequired);

});

Scenario('When I enter an invalid date I see errors', (I) => {

    I.enterAppellantDOBAndContinue('30','02','1981');
    I.click('Continue');
    I.see(mrnDateFields.date.error.invalid);

});

Scenario('When I enter a date in the future I see errors', (I) => {

    I.enterAppellantDOBAndContinue('25','02','3400');
    I.click('Continue');
    I.see(mrnDateFields.date.error.future);

});

Scenario('When I enter a date that is the same as the date on the image I see errors', (I) => {

    I.enterAppellantDOBAndContinue(dateOnImage.day, dateOnImage.month, dateOnImage.year);
    I.click('Continue');
    I.see(mrnDateFields.date.error.dateSameAsImage);

});

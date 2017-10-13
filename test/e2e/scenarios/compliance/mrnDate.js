const DateUtils = require('utils/DateUtils');
const urls = require('urls');
const mrnDateFields = require('steps/compliance/mrn-date/content.en').fields;


Feature('User has an MRN');

Before((I) => {
    I.createTheSession();
    I.amOnPage(urls.compliance.mrnDate);
});

After((I) => {
    I.endTheSession();
});

Scenario('I have an MRN dated one day short of a month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfAMonthAgo());
    I.seeCurrentUrlEquals(urls.identity.areYouAnAppointee);

});

Scenario('I have an MRN dated one month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAgo());
    I.seeCurrentUrlEquals(urls.identity.areYouAnAppointee);

});

Scenario('I have an MRN dated one month and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);

});

Scenario('I have an MRN dated one day short of 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfThirteenMonthsAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);

});

Scenario('I have an MRN dated 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);

});

Scenario('I have an MRN dated 13 months and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);

});

Scenario('I have a MRN but I do not enter the day, month or the year', (I) => {

    I.click('Continue');
    I.see(mrnDateFields.day.error.required);
    I.see(mrnDateFields.month.error.required);
    I.see(mrnDateFields.year.error.required);

});

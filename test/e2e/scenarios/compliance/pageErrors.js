const noMRNContentErrors = require('steps/compliance/no-mrn/content').en.translation.errors;
const mrnDateErrors = require('steps/compliance/mrn-date/content').en.translation.errors;
// const mrnDateOverMonthErrors = require('steps/compliance/mrn-over-month-late/content').en.translation.errors;
// const mrnDateOverThirteenMonthsLateErrors = require('steps/compliance/mrn-over-thirteen-months-late/content').resources.en.translation.errors;

Feature('Page errors');

Scenario('I have a MRN but I do not enter the day, month or the year', (I) => {

    I.amOnPage('/mrn-date');
    I.click('Continue');
    I.seeCurrentUrlEquals('/mrn-date');
    I.see(mrnDateErrors.day.required);
    I.see(mrnDateErrors.month.required);
    I.see(mrnDateErrors.year.required);

});

//Scenario('I have an MRN that is over one month late, I do not enter a reason why my appeal is late, I see errors', (I) => {
//
//    I.amOnPage('/mrn-over-one-month-late');
//    I.click('Continue');
//    I.seeCurrentUrlEquals('/mrn-over-one-month-late');
//    I.see(mrnDateOverMonthErrors.reasonForMRNOverOneMonthLate.required);
//
//});

//Scenario('I have an MRN that is over thirteen months late, I do not enter a reason why my appeal is late, I see errors', (I) => {
//
//    I.amOnPage('/mrn-over-thirteen-months-late');
//    I.click('Continue');
//    I.seeCurrentUrlEquals('/mrn-over-thirteen-months-late');
//    I.see(mrnDateOverThirteenMonthsLateErrors.reasonForMRNOverThirteenMonthsLate.required);
//
//});

Scenario('I do not have an MRN, I have not entered anything, I see errors', (I) => {

    I.amOnPage('/no-mrn');
    I.click('Continue');
    I.seeCurrentUrlEquals('/no-mrn');
    I.see(noMRNContentErrors.reasonForNoMRN.required);

});

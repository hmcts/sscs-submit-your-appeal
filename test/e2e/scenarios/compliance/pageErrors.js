const noMRNContentErrors = require('steps/compliance/no-mrn/content').en.translation;
const mrnDateErrors = require('steps/compliance/mrn-date/content').en.translation;
const mrnDateOverMonthErrors = require('steps/compliance/mrn-over-month-late/content').en.translation;
const mrnDateOverThirteenMonthsLateErrors = require('steps/compliance/mrn-over-thirteen-months-late/content').en.translation;

Feature('Page errors');

Before((I) => {
    I.amOnPage('');
})

Scenario('I have a MRN but I do not enter the day, month or the year', (I) => {

    I.amOnPage('/mrn-date');
    I.click('Continue');
    I.seeCurrentUrlEquals('/mrn-date');
    I.see(mrnDateErrors.fields.day.error.msg);
    I.see(mrnDateErrors.fields.day.error.msg);
    I.see(mrnDateErrors.fields.day.error.msg);

});

Scenario('I have an MRN that is over one month late, I do not enter a reason why my appeal is late, I see errors', (I) => {

    I.amOnPage('/mrn-over-month-late');
    I.click('Continue');
    I.seeCurrentUrlEquals('/mrn-over-month-late');
    I.see(mrnDateOverMonthErrors.fields.reasonForBeingLate.error.msg);

});

Scenario('I have an MRN that is over thirteen months late, I do not enter a reason why my appeal is late, I see errors', (I) => {

    I.amOnPage('/mrn-over-thirteen-months-late');
    I.click('Continue');
    I.seeCurrentUrlEquals('/mrn-over-thirteen-months-late');
    I.see(mrnDateOverThirteenMonthsLateErrors.fields.reasonForBeingLate.error.msg);

});

Scenario('I do not have an MRN, I have not entered anything, I see errors', (I) => {

    I.amOnPage('/no-mrn');
    I.click('Continue');
    I.seeCurrentUrlEquals('/no-mrn');
    I.see(noMRNContentErrors.fields.reasonForNoMRN.error.msg);

});

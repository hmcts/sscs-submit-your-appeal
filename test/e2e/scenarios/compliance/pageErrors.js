const noMRNContentErrors = require('steps/compliance/no-mrn/content').en.translation;
const mrnDateFields = require('steps/compliance/mrn-date/content').en.translation.fields;
const mrnDateOverMonthErrors = require('steps/compliance/mrn-over-month-late/content').en.translation;
const mrnDateOverThirteenMonthsLateErrors = require('steps/compliance/mrn-over-thirteen-months-late/content').en.translation;
const urls = require('urls');

const Continue = 'Continue';

Feature('Page errors');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('I have a MRN but I do not enter the day, month or the year', (I) => {

    I.amOnPage(urls.compliance.mrnDate);
    I.click(Continue);
    I.see(mrnDateFields.day.error.msg);
    I.see(mrnDateFields.month.error.msg);
    I.see(mrnDateFields.year.error.msg);

});

Scenario('I have an MRN that is over one month late, I do not enter a reason why my appeal is late, I see errors', (I) => {

    I.amOnPage(urls.compliance.mrnOverMonthLate);
    I.click(Continue);
    I.seeCurrentUrlEquals(urls.compliance.mrnOverMonthLate);
    I.see(mrnDateOverMonthErrors.fields.reasonForBeingLate.error.msg);

});

Scenario('I have an MRN that is over thirteen months late, I do not enter a reason why my appeal is late, I see errors', (I) => {

    I.amOnPage(urls.compliance.mrnOverThirteenMonthsLate);
    I.click(Continue);
    I.seeCurrentUrlEquals(urls.compliance.mrnOverThirteenMonthsLate);
    I.see(mrnDateOverThirteenMonthsLateErrors.fields.reasonForBeingLate.error.msg);

});

Scenario('I do not have an MRN, I have not entered anything, I see errors', (I) => {

    I.amOnPage(urls.compliance.noMRN);
    I.click(Continue);
    I.seeCurrentUrlEquals(urls.compliance.noMRN);
    I.see(noMRNContentErrors.fields.reasonForNoMRN.error.msg);

});

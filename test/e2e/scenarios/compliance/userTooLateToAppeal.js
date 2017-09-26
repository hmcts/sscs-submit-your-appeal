const mrnOverMonthLate = require('steps/compliance/mrn-over-month-late/content.json').en.translation;
const mrnOverThirteenMonthLate = require('steps/compliance/mrn-over-thirteen-months-late/content.json').en.translation;
const cantAppeal = require('steps/compliance/cant-appeal/content.json').en.translation;
const DateUtils = require('utils/DateUtils');
const urls = require('urls');

Feature('It is too late for a user to appeal');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('MRN is older than a month, no reason why Appeal is late, user cannot appeal', (I) => {

    I.amOnPage(urls.compliance.mrnDate);
    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);
    I.click('Yes');
    I.click('Continue');
    I.seeCurrentUrlEquals(urls.compliance.mrnOverMonthLate);
    I.click(mrnOverMonthLate.noGoodReasonWhyLate);
    I.seeCurrentUrlEquals(urls.compliance.cantAppeal);
    I.see(cantAppeal.title);

});

Scenario('MRN is older than 13 months, no reason why Appeal is late, user cannot appeal', (I) => {

    I.amOnPage(urls.compliance.mrnDate);
    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals(urls.compliance.checkMRNDate);
    I.click('Yes');
    I.click('Continue');
    I.seeCurrentUrlEquals(urls.compliance.mrnOverThirteenMonthsLate);
    I.click(mrnOverThirteenMonthLate.noGoodReasonWhyLate);
    I.seeCurrentUrlEquals(urls.compliance.cantAppeal);
    I.see(cantAppeal.title);

});

Scenario('I exit the service after being told I cannot appeal', (I) => {

    I.amOnPage(urls.compliance.cantAppeal);
    I.click('Return to GOV.UK');
    I.amOnPage('https://www.gov.uk');

});

//const mrnOverMonthLate = require('steps/compliance/mrn-over-month-late/content.json').resources.en.translation.content;
//const mrnOverThirteenMonthLate = require('steps/compliance/mrn-over-thirteen-months-late/content.json').resources.en.translation.content;
//const cantAppeal = require('steps/compliance/cant-appeal/content.json').resources.en.translation.content;
//const common = require('app/content/common.json').resources.en.translation;
const DateUtils = require('utils/DateUtils');

Feature('It is too late for a user to appeal');

Scenario('MRN is older than a month, no reason why Appeal is late, user cannot appeal', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals('/mrn-over-one-month-late');
    I.click(mrnOverMonthLate.noGoodReasonWhyLate);
    I.seeCurrentUrlEquals('/cant-appeal');
    I.see(cantAppeal.title);

});

Scenario('MRN is older than 13 months, no reason why Appeal is late, user cannot appeal', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals('/mrn-over-thirteen-months-late');
    I.click(mrnOverThirteenMonthLate.noGoodReasonWhyLate);
    I.seeCurrentUrlEquals('/cant-appeal');
    I.see(cantAppeal.title);

});

Scenario('I exit the service after being told I cannot appeal', (I) => {

    I.amOnPage('/cant-appeal');
    I.click(common.exitService);
    I.amOnPage('https://www.gov.uk');

});

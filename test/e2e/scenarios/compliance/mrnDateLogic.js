//const DateUtils = require('utils/DateUtils');

Feature('User has an MRN');

//Scenario('I have an MRN dated one day short of a month ago', (I) => {
//
//console.log('meow')
//
//    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfAMonthAgo());
//    I.seeCurrentUrlEquals('/appointee');
//
//});

Scenario('I have an MRN dated one month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAgo());
    I.seeCurrentUrlEquals('/appointee');

});

Scenario('I have an MRN dated one month and one day ago', (I) => {

    I.enterAnMRNDateAndoContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals('/mrn-over-one-month-late');
    
});

Scenario('I have an MRN dated one day short of 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfThirteenMonthsAgo());
    I.seeCurrentUrlEquals('/mrn-over-one-month-late');

});

Scenario('I have an MRN dated 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAgo());
    I.seeCurrentUrlEquals('/mrn-over-one-month-late');

});

Scenario('I have an MRN dated 13 months and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals('/mrn-over-thirteen-months-late');

});

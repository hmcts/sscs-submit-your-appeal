const DateUtils = require('utils/DateUtils');

Feature('User has an MRN');

Before((I) => {
      I.amOnPage('');
  })

Scenario('I have an MRN dated one day short of a month ago', (I) => {
    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfAMonthAgo());
    I.seeCurrentUrlEquals('/are-you-an-appointee');

});

Scenario('I have an MRN dated one month ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAgo());
    I.seeCurrentUrlEquals('/are-you-an-appointee');

});

Scenario('I have an MRN dated one month and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneMonthAndOneDayAgo());
    I.seeCurrentUrlEquals('/check-mrn-date');
    
});

Scenario('I have an MRN dated one day short of 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.oneDayShortOfThirteenMonthsAgo());
    I.seeCurrentUrlEquals('/check-mrn-date');

});

Scenario('I have an MRN dated 13 months ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAgo());
    I.seeCurrentUrlEquals('/check-mrn-date');

});

Scenario('I have an MRN dated 13 months and one day ago', (I) => {

    I.enterAnMRNDateAndContinue(DateUtils.thirteenMonthsAndOneDayAgo());
    I.seeCurrentUrlEquals('/check-mrn-date');

});

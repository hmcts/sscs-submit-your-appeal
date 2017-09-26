function enterAnMRNDateAndContinue(date) {

    const I = this;

    I.amOnPage('/mrn-date');
    I.fillField('Day',  date.date());
    I.fillField('Month', date.month() + 1);
    I.fillField('Year',  date.year());
    I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };
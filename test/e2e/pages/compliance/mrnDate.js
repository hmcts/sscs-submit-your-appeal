function enterAnMRNDateAndContinue(date) {

    const I = this;

    I.amOnPage('/mrn-date');
    I.fillField('day',   date.date());
    I.fillField('month', date.month() + 1);
    I.fillField('year',  date.year());
    I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };
function enterAnMRNDateAndContinue(date) {

    const I = this;

    I.fillField('MRNDate_day',  date.date());
    I.fillField('MRNDate_month', date.month() + 1);
    I.fillField('MRNDate_year',  date.year());
    I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };

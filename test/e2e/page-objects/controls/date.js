function enterADateAndContinue(day, month, year) {

    const I = this;

    I.fillField('.form-group-day input',  day);
    I.fillField('.form-group-month input', month);
    I.fillField('.form-group-year input',  year);
    I.click('Continue');
}

module.exports = { enterADateAndContinue };

function enterAnMRNDateAndContinue(date) {
  const I = this;

  I.fillField('.form-group-day input', date.date());
  I.fillField('.form-group-month input', date.month() + 1);
  I.fillField('.form-group-year input', date.year());
  I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };

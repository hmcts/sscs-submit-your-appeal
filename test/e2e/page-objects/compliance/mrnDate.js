function enterAnMRNDateAndContinue(date) {
  const I = this;

  I.fillField('.form-group-day input', date.date().toString());
  I.fillField('.form-group-month input', (date.month() + 1).toString());
  I.fillField('.form-group-year input', date.year().toString());
  I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };

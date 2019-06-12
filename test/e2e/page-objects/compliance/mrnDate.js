function enterAnMRNDateAndContinue(date) {
  const I = this;

  I.fillField('.govuk-form-group-day input', date.date().toString());
  I.fillField('.govuk-form-group-month input', (date.month() + 1).toString());
  I.fillField('.govuk-form-group-year input', date.year().toString());
  I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };

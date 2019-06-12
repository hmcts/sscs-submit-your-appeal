function enterADateAndContinue(day, month, year) {
  const I = this;

  I.fillField('.govuk-form-group-day input', day);
  I.fillField('.govuk-form-group-month input', month);
  I.fillField('.govuk-form-group-year input', year);
  I.click('Continue');
}

module.exports = { enterADateAndContinue };

function enterAnMRNDateAndContinue(date) {
  const I = this;

  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.click('Continue');
}

module.exports = { enterAnMRNDateAndContinue };

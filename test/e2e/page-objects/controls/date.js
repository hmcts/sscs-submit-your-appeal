function enterADateAndContinue(day, month, year) {
  const I = this;

  I.fillField('input[name*="day"]', day);
  I.fillField('input[name*="month"]', month);
  I.fillField('input[name*="year"]', year);
  I.click('Continue');
}

module.exports = { enterADateAndContinue };

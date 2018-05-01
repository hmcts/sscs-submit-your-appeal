function enterDateCantAttendAndContinue(date, link) {
  const I = this;

  I.click(link);
  I.fillField('.form-group-day input', date.date());
  I.fillField('.form-group-month input', date.month() + 1);
  I.fillField('.form-group-year input', date.year());
  I.click('Continue');
}

function seeFormattedDate(date) {
  const I = this;

  I.see(date.format('dddd D MMMM YYYY'));
}

function dontSeeFormattedDate(date) {
  const I = this;

  I.dontSee(date.format('dddd D MMMM YYYY'));
}

module.exports = {
  enterDateCantAttendAndContinue,
  seeFormattedDate,
  dontSeeFormattedDate
};

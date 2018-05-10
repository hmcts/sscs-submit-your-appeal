const assert = require('assert');
const moment = require('moment');

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

function* hasSelectedClass(element) {
  const I = this;

  const classes = yield I.grabAttributeFrom(element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, true);
}

function* doesntHaveSelectedClass(element) {
  const I = this;

  const classes = yield I.grabAttributeFrom(element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, false);
}

function* selectDates(dates) {
  const I = this;

   for (let date of dates) {
     const element = `//*[@data-date="${date}"]`;
     I.click(element);
     I.seeFormattedDate(moment(date));
     yield * I.hasSelectedClass(element);
   }
}

function* deselectDates(dates) {
  const I = this;

  for (let date of dates) {
    const element = `//*[@data-date="${date}"]`;
    I.click(element);
    I.dontSeeFormattedDate(moment(date));
    yield * I.doesntHaveSelectedClass(element);
  }
}

module.exports = {
  enterDateCantAttendAndContinue,
  seeFormattedDate,
  dontSeeFormattedDate,
  hasSelectedClass,
  doesntHaveSelectedClass,
  selectDates,
  deselectDates
};

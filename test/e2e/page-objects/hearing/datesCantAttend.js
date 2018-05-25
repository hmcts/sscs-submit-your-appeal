/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');

function enterDateCantAttendAndContinue(date, link) {
  const I = this;

  I.click(link);
  I.fillField('.form-group-day input', date.date().toString());
  I.fillField('.form-group-month input', (date.month() + 1).toString());
  I.fillField('.form-group-year input', date.year().toString());
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

async function hasSelectedClass(element) {
  const I = this;

  const classes = await I.grabAttributeFrom(element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, true);
}

async function doesntHaveSelectedClass(element) {
  const I = this;

  const classes = await I.grabAttributeFrom(element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, false);
}

async function selectDates(dates) {
  const I = this;

  I.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    I.click(element);
    I.seeFormattedDate(moment(date));
    await I.hasSelectedClass(element);
  }
}

async function deselectDates(dates) {
  const I = this;

  I.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    I.click(element);
    I.dontSeeFormattedDate(moment(date));
    await I.doesntHaveSelectedClass(element);
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

/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

function enterDateCantAttendAndContinue(commonContent, date, link) {
  const I = this;

  I.forceClick(link);
  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.forceClick(commonContent.continue);
}

function seeFormattedDate(date) {
  const I = this;

  I.see(DateUtils.formatDate(date, 'dddd D MMMM YYYY'));
}

function dontSeeFormattedDate(date) {
  const I = this;
  I.wait(2);
  I.dontSee(DateUtils.formatDate(date, 'dddd D MMMM YYYY'));
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

async function selectDates(language, dates) {
  moment().locale(language);

  const I = this;
  I.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await I.clickNextIfDateNotVisible(date);
    I.click(element);
    I.wait(1);
    I.seeFormattedDate(moment(date));
    await I.hasSelectedClass(element);
  }
}

async function deselectDates(language, dates) {
  moment().locale(language);

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

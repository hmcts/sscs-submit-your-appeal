/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

function enterDateCantAttendAndContinue(commonContent, date, link) {
  const I = this;

  I.click(link);
  I.fillField('input[name*="day"]', date.date().toString());
  I.fillField('input[name*="month"]', (date.month() + 1).toString());
  I.fillField('input[name*="year"]', date.year().toString());
  I.click(commonContent.continue);
}

function seeFormattedDate(language, date) {
  const I = this;

  I.see(DateUtils.formatDate(date, 'dddd D MMMM YYYY', language));
}

function dontSeeFormattedDate(language, date) {
  const I = this;
  I.wait(5);
  I.dontSee(DateUtils.formatDate(date, 'dddd D MMMM YYYY', language));
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
  const I = this;
  I.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await I.clickNextIfDateNotVisible(date);
    I.click(element);
    I.wait(3);
    I.seeFormattedDate(language, moment(date));
    await I.hasSelectedClass(element);
  }
}

async function deselectDates(language, dates) {
  const I = this;

  I.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    I.click(element);
    I.dontSeeFormattedDate(language, moment(date));
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

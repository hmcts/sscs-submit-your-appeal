/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');
const myHelper = require("../../helpers/helper");

function enterDateCantAttendAndContinue(page, commonContent, date, link) {
  

  forceClick(page, link);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  forceClick(page, commonContent.continue);
}

function seeFormattedDate(page, date) {
  

  expect(page.getByText(DateUtils.formatDate(date, 'dddd D MMMM YYYY'))).toBeVisible();
}

function dontSeeFormattedDate(date) {
  
  await page.waitForTimeout(2);
  page.dontSee(DateUtils.formatDate(date, 'dddd D MMMM YYYY'));
}

async function hasSelectedClass(page, element) {
  

  const classes = await grabAttributeFrom(page, element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, true);
}

async function doesntHaveSelectedClass(page, element) {
  

  const classes = await grabAttributeFrom(page, element, 'class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, false);
}

async function selectDates(page, language, dates) {
  moment().locale(language);

  
  page.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await myHelper.clickNextIfDateNotVisible(page, date);
    await page.click(element);
    await page.waitForTimeout(1);
    seeFormattedDate(page, moment(date));
    await hasSelectedClass(page, element);
  }
}

async function deselectDates(page, language, dates) {
  moment().locale(language);

  

  page.waitForElement('#date-picker table', 10);
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await page.click(element);
    page.dontSeeFormattedDate(moment(date));
    await doesntHaveSelectedClass(page, element);
  }
}

module.exports = {
  enterDateCantAttendAndContinue,
  seeFormattedDate,
  dontSeeFormattedDate,
  hasSelectedClass,
  doesntHaveSelectedClass,
  selectDates,
  deselectDates,
};

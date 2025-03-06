/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');
const { expect } = require('@playwright/test');
const { clickNextIfDateNotVisible } = require('../../helpers/helper');

async function enterDateCantAttendAndContinue(I, commonContent, date, link) {
  await I.click(link);
  await I.locator('input[name*="day"]').first().fill(date.date().toString());
  await I.locator('input[name*="month"]')
    .first()
    .fill((date.month() + 1).toString());
  await I.locator('input[name*="year"]').first().fill(date.year().toString());
  await I.click(commonContent.continue);
}

async function seeFormattedDate(I, date) {
  await expect(
    I.getByText(DateUtils.formatDate(date, 'dddd D MMMM YYYY')).first()
  ).toBeVisible();
}

async function dontSeeFormattedDate(I, date) {
  await expect(
    I.getByText(DateUtils.formatDate(date, 'dddd D MMMM YYYY')).first()
  ).toBeHidden();
}

async function hasSelectedClass(I, element) {
  const classes = await I.locator(element).getAttribute('class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, true);
}

async function doesntHaveSelectedClass(I, element) {
  const classes = await I.locator(element).getAttribute('class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, false);
}

async function selectDates(I, language, dates) {
  moment().locale(language);

  await expect(I.locator('#date-picker table').first()).toBeVisible();
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await clickNextIfDateNotVisible(I, date);
    await I.locator(element).first().click();
    await seeFormattedDate(I, moment(date));
    await hasSelectedClass(I, element);
  }
}

async function deselectDates(I, language, dates) {
  moment().locale(language);

  await expect(I.locator('#date-picker table').first()).toBeVisible();
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await I.locator(element).first().click();
    await dontSeeFormattedDate(I, moment(date));
    await doesntHaveSelectedClass(I, element);
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

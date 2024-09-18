/* eslint-disable no-await-in-loop */
const assert = require('assert');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');
const myHelper = require('../../helpers/helper');
const { expect } = require('@playwright/test');

async function enterDateCantAttendAndContinue(page, commonContent, date, link) {
  await page.click(link);
  await page.fill('input[name*="day"]', date.date().toString());
  await page.fill('input[name*="month"]', (date.month() + 1).toString());
  await page.fill('input[name*="year"]', date.year().toString());
  await page.click(commonContent.continue);
}

async function seeFormattedDate(page, date) {
  await expect(page.getByText(DateUtils.formatDate(date, 'dddd D MMMM YYYY'))).toBeVisible();
}

async function dontSeeFormattedDate(page, date) {
  await page.waitForTimeout(2000);
  await expect(page.getByText(DateUtils.formatDate(date, 'dddd D MMMM YYYY'))).not.toBeVisible();
}

async function hasSelectedClass(page, element) {
  const classes = await page.locator(element).getAttribute('class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, true);
}

async function doesntHaveSelectedClass(page, element) {
  const classes = await page.locator(element).getAttribute('class');
  const hasClass = classes.includes('active');
  assert.equal(hasClass, false);
}

async function selectDates(page, language, dates) {
  moment().locale(language);


  await page.locator('#date-picker table').first().waitFor({ timeout: 10000 });
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await myHelper.clickNextIfDateNotVisible(page, date);
    await page.click(element);
    await page.waitForTimeout(1000);
    await seeFormattedDate(page, moment(date));
    await hasSelectedClass(page, element);
  }
}

async function deselectDates(page, language, dates) {
  moment().locale(language);


  await page.locator('#date-picker table').first().waitFor({ timeout: 10000 });
  for (const date of dates) {
    const element = `//*[@data-date="${date}"]`;
    await page.click(element);
    await dontSeeFormattedDate(page, moment(date));
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
  deselectDates
};

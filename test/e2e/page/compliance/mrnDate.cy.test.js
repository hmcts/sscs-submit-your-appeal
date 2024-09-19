const language = 'cy';
const commonContent = require('../../../../commonContent')[language];
const mrnDateContent = require(`../../../../steps/compliance/mrn-date/content.${language}`);
const DateUtils = require('../../../../utils/DateUtils');
const paths = require('../../../../paths');
const dateOnImage = require('../../../../steps/compliance/mrn-date/mrnDateOnImage');
const moment = require('moment');

const date = {
  day: '20',
  year: '2016'
};

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { enterAnMRNDateAndContinue } = require('../../page-objects/compliance/mrnDate');
const { enterADateAndContinue } = require('../../page-objects/controls/date');
const { config } = require('config');

/* eslint-disable-next-line no-process-env */
const baseUrl = process.env.TEST_URL || config.get('e2e.frontendUrl');

test.describe(`${language.toUpperCase()} - User has an MRN @batch-07`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(baseUrl + paths.compliance.mrnDate);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one day short of a month ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.oneDayShortOfAMonthAgo());
    await page.waitForURL(`**/${paths.identity.enterAppellantName}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated as the current date`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, moment());
    await page.waitForURL(`**/${paths.identity.enterAppellantName}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one month ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.oneMonthAgo());
    await page.waitForURL(`**/${paths.identity.enterAppellantName}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one month and one day ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.oneMonthAndOneDayAgo());
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one day short of 13 months ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.oneDayShortOfThirteenMonthsAgo());
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated 13 months ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.thirteenMonthsAgo());
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I have an MRN dated 13 months and one day ago`, async({ page }) => {
    await enterAnMRNDateAndContinue(page, commonContent, DateUtils.thirteenMonthsAndOneDayAgo());
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I have a MRN but I do not enter the day, month or the year`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(mrnDateContent.fields.date.error.allRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the day field I see errors`, async({ page }) => {
    await page.fill('input[name*="day"]', '21');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(mrnDateContent.fields.date.error.monthRequired).first()).toBeVisible();
    await expect(page.getByText(mrnDateContent.fields.date.error.yearRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the month field I see errors`, async({ page }) => {
    await page.fill('input[name*="month"]', '12');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(mrnDateContent.fields.date.error.yearRequired).first()).toBeVisible();
    await expect(page.getByText(mrnDateContent.fields.date.error.dayRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the year field I see errors`, async({ page }) => {
    await page.fill('input[name*="year"]', '1999');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(mrnDateContent.fields.date.error.monthRequired).first()).toBeVisible();
    await expect(page.getByText(mrnDateContent.fields.date.error.dayRequired).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter an invalid date I see errors`, async({ page }) => {
    await enterADateAndContinue(page, commonContent, '30', '02', '1981');
    await expect(page.getByText(mrnDateContent.fields.date.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date in the future I see errors`, async({ page }) => {
    await enterADateAndContinue(page, commonContent, '25', '02', '3400');
    await expect(page.getByText(mrnDateContent.fields.date.error.future).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date that is the same as the date on the image I see errors`, async({ page }) => {
    await enterADateAndContinue(page, commonContent, dateOnImage.day, dateOnImage.month, dateOnImage.year);
    await expect(page.getByText(mrnDateContent.fields.date.error.dateSameAsImage).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a MRN date with name of month`, async({ page }) => {
    date.month = 'ocToBer';
    await enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I enter a MRN date with the short name of month`, async({ page }) => {
    date.month = 'aUg';
    await enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    await page.waitForURL(`**/${paths.compliance.checkMRNDate}`);
  });

  test(`${language.toUpperCase()} - I enter a MRN date with an invalid name of month`, async({ page }) => {
    date.month = 'invalidMonth';
    await enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    await expect(page.getByText(mrnDateContent.fields.date.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});

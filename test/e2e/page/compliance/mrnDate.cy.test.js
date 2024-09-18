const language = 'cy';
const commonContent = require('commonContent')[language];
const mrnDateContent = require(`steps/compliance/mrn-date/content.${language}`);
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const dateOnImage = require('steps/compliance/mrn-date/mrnDateOnImage');
const moment = require('moment');

const date = {
  day: '20',
  year: '2016',
};

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - User has an MRN @batch-07`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.mrnDate);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one day short of a month ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.oneDayShortOfAMonthAgo());
    page.seeCurrentUrlEquals(paths.identity.enterAppellantName);
  });

  test(`${language.toUpperCase()} - I have an MRN dated as the current date`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, moment());
    page.seeCurrentUrlEquals(paths.identity.enterAppellantName);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one month ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.oneMonthAgo());
    page.seeCurrentUrlEquals(paths.identity.enterAppellantName);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one month and one day ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.oneMonthAndOneDayAgo());
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I have an MRN dated one day short of 13 months ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.oneDayShortOfThirteenMonthsAgo());
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I have an MRN dated 13 months ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.thirteenMonthsAgo());
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I have an MRN dated 13 months and one day ago`, ({ page }) => {
    await enterAnMRNDateAndContinue(page,  commonContent, DateUtils.thirteenMonthsAndOneDayAgo());
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I have a MRN but I do not enter the day, month or the year`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(mrnDateContent.fields.date.error.allRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the day field I see errors`, ({ page }) => {
    await page.fill('input[name*="day"]', '21');
    await page.click(commonContent.continue);
    expect(page.getByText(mrnDateContent.fields.date.error.monthRequired)).toBeVisible();
    expect(page.getByText(mrnDateContent.fields.date.error.yearRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the month field I see errors`, ({ page }) => {
    await page.fill('input[name*="month"]', '12');
    await page.click(commonContent.continue);
    expect(page.getByText(mrnDateContent.fields.date.error.yearRequired)).toBeVisible();
    expect(page.getByText(mrnDateContent.fields.date.error.dayRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the year field I see errors`, ({ page }) => {
    await page.fill('input[name*="year"]', '1999');
    await page.click(commonContent.continue);
    expect(page.getByText(mrnDateContent.fields.date.error.monthRequired)).toBeVisible();
    expect(page.getByText(mrnDateContent.fields.date.error.dayRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter an invalid date I see errors`, ({ page }) => {
    enterADateAndContinue(page, commonContent, '30', '02', '1981');
    expect(page.getByText(mrnDateContent.fields.date.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date in the future I see errors`, ({ page }) => {
    enterADateAndContinue(page, commonContent, '25', '02', '3400');
    expect(page.getByText(mrnDateContent.fields.date.error.future)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date that is the same as the date on the image I see errors`, ({
    page,
  }) => {
    enterADateAndContinue(page, commonContent, dateOnImage.day, dateOnImage.month, dateOnImage.year);
    expect(page.getByText(mrnDateContent.fields.date.error.dateSameAsImage)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a MRN date with name of month`, ({ page }) => {
    date.month = 'ocToBer';
    enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I enter a MRN date with the short name of month`, ({ page }) => {
    date.month = 'aUg';
    enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    page.seeCurrentUrlEquals(paths.compliance.checkMRNDate);
  });

  test(`${language.toUpperCase()} - I enter a MRN date with an invalid name of month`, ({ page }) => {
    date.month = 'invalidMonth';
    enterADateAndContinue(page, commonContent, date.day, date.month, date.year);
    expect(page.getByText(mrnDateContent.fields.date.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I have a csrf token`, ({ page }) => {
    page.seeElementInDOM('form input[name="_csrf"]');
  });
});

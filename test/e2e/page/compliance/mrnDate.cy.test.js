const language = 'cy';
const commonContent = require('commonContent')[language];
const mrnDateContent = require(`steps/compliance/mrn-date/content.${language}`);
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const dateOnImage = require('steps/compliance/mrn-date/mrnDateOnImage');
const moment = require('moment');

const date = {
  day: '20',
  year: '2016'
};

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  enterAnMRNDateAndContinue
} = require('../../page-objects/compliance/mrnDate');
const { enterADateAndContinue } = require('../../page-objects/controls/date');

test.describe(
  `${language.toUpperCase()} - User has an MRN`,
  { tag: '@batch-07' },
  () => {
    test.beforeEach('Create session', async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.compliance.mrnDate);
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - page have an MRN dated one day short of a month ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.oneDayShortOfAMonthAgo(page)
      );
      await expect(page).toHaveURL(paths.identity.enterAppellantName);
    });

    test(`${language.toUpperCase()} - page have an MRN dated as the current date`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(page, commonContent, moment());
      await expect(page).toHaveURL(paths.identity.enterAppellantName);
    });

    test(`${language.toUpperCase()} - page have an MRN dated one month ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.oneMonthAgo(page)
      );
      await expect(page).toHaveURL(paths.identity.enterAppellantName);
    });

    test(`${language.toUpperCase()} - page have an MRN dated one month and one day ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.oneMonthAndOneDayAgo(page)
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page have an MRN dated one day short of 13 months ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.oneDayShortOfThirteenMonthsAgo(page)
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page have an MRN dated 13 months ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.thirteenMonthsAgo(page)
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page have an MRN dated 13 months and one day ago`, async ({
      page
    }) => {
      await enterAnMRNDateAndContinue(
        commonContent,
        DateUtils.thirteenMonthsAndOneDayAgo(page)
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page have a MRN but page do not enter the day, month or the year`, async ({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.allRequired).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the day field page see errors`, async ({
      page
    }) => {
      await page.locator('input[name*="day"]').first().fill('21');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.monthRequired).first()
      ).toBeVisible();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.yearRequired).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the month field page see errors`, async ({
      page
    }) => {
      await page.locator('input[name*="month"]').first().fill('12');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.yearRequired).first()
      ).toBeVisible();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.dayRequired).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the year field page see errors`, async ({
      page
    }) => {
      await page.locator('input[name*="year"]').first().fill('1999');
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.monthRequired).first()
      ).toBeVisible();
      await expect(
        page.getByText(mrnDateContent.fields.date.error.dayRequired).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page enter an invalid date page see errors`, async ({
      page
    }) => {
      await enterADateAndContinue(page, commonContent, '30', '02', '1981');
      await expect(
        page.getByText(mrnDateContent.fields.date.error.invalid).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page enter a date in the future page see errors`, async ({
      page
    }) => {
      await enterADateAndContinue(page, commonContent, '25', '02', '3400');
      await expect(
        page.getByText(mrnDateContent.fields.date.error.future).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page enter a date that is the same as the date on the image page see errors`, async ({
      page
    }) => {
      await enterADateAndContinue(
        page,
        commonContent,
        dateOnImage.day,
        dateOnImage.month,
        dateOnImage.year
      );
      await expect(
        page.getByText(mrnDateContent.fields.date.error.dateSameAsImage).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - page enter a MRN date with name of month`, async ({
      page
    }) => {
      date.month = 'ocToBer';
      await enterADateAndContinue(
        page,
        commonContent,
        date.day,
        date.month,
        date.year
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page enter a MRN date with the short name of month`, async ({
      page
    }) => {
      date.month = 'aUg';
      await enterADateAndContinue(
        page,
        commonContent,
        date.day,
        date.month,
        date.year
      );
      await expect(page).toHaveURL(paths.compliance.checkMRNDate);
    });

    test(`${language.toUpperCase()} - page enter a MRN date with an invalid name of month`, async ({
      page
    }) => {
      date.month = 'invalidMonth';
      await enterADateAndContinue(
        page,
        commonContent,
        date.day,
        date.month,
        date.year
      );
      await expect(
        page.getByText(mrnDateContent.fields.date.error.invalid).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - page have a csrf token`, async ({
      page
    }) => {
      await expect(
        page.locator('form input[name="_csrf"]').first()
      ).toBeVisible();
    });
  }
);

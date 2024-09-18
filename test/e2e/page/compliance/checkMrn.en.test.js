const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const moment = require('moment');
const answer = require('utils/answer');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Check MRN @batch-07`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.compliance.mrnDate);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I select YES to MRN date is >1 month and <=13 months, I see /mrn-over-month-late`, ({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(2, 'months');
    goToCheckMrnPage(page, commonContent, mrnDate);
    goToCorrectPageAfterCheckMRN(page, commonContent, answer.YES, paths.compliance.mrnOverMonthLate);
  });

  test(`${language.toUpperCase()} - I select YES to MRN date is >13 months, I asee url /mrn-over-thirteen-months-late`, ({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(14, 'months');
    goToCheckMrnPage(page, commonContent, mrnDate);
    goToCorrectPageAfterCheckMRN(page, commonContent, answer.YES, paths.compliance.mrnOverThirteenMonthsLate);
  });

  test(`${language.toUpperCase()} - I select NO, I am taken to /mrn-date`, ({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(2, 'months');
    goToCheckMrnPage(page, commonContent, mrnDate);
    goToCorrectPageAfterCheckMRN(page, commonContent, answer.NO, paths.compliance.mrnDate);
  });
});

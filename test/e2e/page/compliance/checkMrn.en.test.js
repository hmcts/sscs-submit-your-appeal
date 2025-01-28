const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const moment = require('moment');
const answer = require('utils/answer');

const { test } = require('@playwright/test');
const {
  goToCorrectPageAfterCheckMRN,
  goToCheckMrnPage
} = require('../../page-objects/compliance/checkMrn');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Check MRN`, { tag: '@batch-07' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.compliance.mrnDate);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - page select YES to MRN date is >1 month and <=13 months, page see /mrn-over-month-late`, async({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(2, 'months');
    await goToCheckMrnPage(page, commonContent, mrnDate);
    await goToCorrectPageAfterCheckMRN(page, commonContent, answer.YES, paths.compliance.mrnOverMonthLate);
  });

  test(`${language.toUpperCase()} - page select YES to MRN date is >13 months, page asee url /mrn-over-thirteen-months-late`, async({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(14, 'months');
    await goToCheckMrnPage(page, commonContent, mrnDate);
    await goToCorrectPageAfterCheckMRN(page, commonContent, answer.YES, paths.compliance.mrnOverThirteenMonthsLate);
  });

  test(`${language.toUpperCase()} - page select NO, page am taken to /mrn-date`, async({ page }) => {
    moment().locale(language);

    const mrnDate = moment().subtract(2, 'months');
    await goToCheckMrnPage(page, commonContent, mrnDate);
    await goToCorrectPageAfterCheckMRN(page, commonContent, answer.NO, paths.compliance.mrnDate);
  });
});

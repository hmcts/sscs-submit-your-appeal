const language = 'cy';
const commonContent = require('commonContent')[language];
const paths = require('paths');
const moment = require('moment');
const answer = require('utils/answer');

Feature(`${language.toUpperCase()} - Check MRN @batch-07`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.compliance.mrnDate);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I select YES to MRN date is >1 month and <=13 months, I see /mrn-over-month-late`, ({ I }) => {
  moment().locale(language);

  const mrnDate = moment().subtract(2, 'months');
  I.goToCheckMrnPage(commonContent, mrnDate);
  I.goToCorrectPageAfterCheckMRN(commonContent, answer.YES, paths.compliance.mrnOverMonthLate);
});

Scenario(`${language.toUpperCase()} - I select YES to MRN date is >13 months, I asee url /mrn-over-thirteen-months-late`, ({ I }) => {
  moment().locale(language);

  const mrnDate = moment().subtract(14, 'months');
  I.goToCheckMrnPage(commonContent, mrnDate);
  I.goToCorrectPageAfterCheckMRN(commonContent, answer.YES, paths.compliance.mrnOverThirteenMonthsLate);
});

Scenario(`${language.toUpperCase()} - I select NO, I am taken to /mrn-date`, ({ I }) => {
  moment().locale(language);

  const mrnDate = moment().subtract(2, 'months');
  I.goToCheckMrnPage(commonContent, mrnDate);
  I.goToCorrectPageAfterCheckMRN(commonContent, answer.NO, paths.compliance.mrnDate);
});

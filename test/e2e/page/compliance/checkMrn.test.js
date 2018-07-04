const paths = require('paths');
const moment = require('moment');
const answer = require('utils/answer');

Feature('Check MRN @batch-07');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.compliance.mrnDate);
});

After(I => {
  I.endTheSession();
});

Scenario('I select YES to MRN date is >1 month and <=13 months, I see /mrn-over-month-late', I => {
  const mrnDate = moment().subtract(2, 'months');
  I.goToCheckMrnPage(mrnDate);
  I.goToCorrectPageAfterCheckMRN(answer.YES, paths.compliance.mrnOverMonthLate);
});

Scenario('I select YES to MRN date is >13 months, I asee url /mrn-over-thirteen-months-late', I => {
  const mrnDate = moment().subtract(14, 'months');
  I.goToCheckMrnPage(mrnDate);
  I.goToCorrectPageAfterCheckMRN(answer.YES, paths.compliance.mrnOverThirteenMonthsLate);
});

Scenario('I select NO, I am taken to /mrn-date', I => {
  const mrnDate = moment().subtract(2, 'months');
  I.goToCheckMrnPage(mrnDate);
  I.goToCorrectPageAfterCheckMRN(answer.NO, paths.compliance.mrnDate);
});

const paths = require('paths');

function goToCheckMrnPage(mrnDate) {
  const I = this;

  I.fillField('.form-group-day input', mrnDate.date().toString());
  I.fillField('.form-group-month input', (mrnDate.month() + 1).toString());
  I.fillField('.form-group-year input', mrnDate.year().toString());
  I.click('Continue');
  I.seeInCurrentUrl(paths.compliance.checkMRNDate);
}

function goToCorrectPageAfterCheckMRN(value, url) {
  const I = this;

  I.checkOption(`#checkedMRN-${value}`);
  I.click('Continue');
  I.seeInCurrentUrl(url);
}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };

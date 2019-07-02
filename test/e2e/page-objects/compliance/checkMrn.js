const paths = require('paths');

function goToCheckMrnPage(mrnDate) {
  const I = this;

  I.fillField('#mrnDate.day', mrnDate.date().toString());
  I.fillField('mrnDate.month', (mrnDate.month() + 1).toString());
  I.fillField('mrnDate.year', mrnDate.year().toString());
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

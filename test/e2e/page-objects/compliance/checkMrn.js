const paths = require('paths');

function goToCheckMrnPage(commonContent, mrnDate) {
  const I = this;

  I.fillField('#mrnDate.day', mrnDate.date().toString());
  I.fillField('mrnDate.month', (mrnDate.month() + 1).toString());
  I.fillField('mrnDate.year', mrnDate.year().toString());
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.compliance.checkMRNDate);
}

function goToCorrectPageAfterCheckMRN(commonContent, value, url) {
  const I = this;

  I.checkOption(`#checkedMRN-${value}`);
  I.click(commonContent.continue);
  I.seeInCurrentUrl(url);
}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };

const paths = require('paths');

function goToCheckMrnPage(commonContent, mrnDate) {
  

  await page.fill('#mrnDate.day', mrnDate.date().toString());
  await page.fill('mrnDate.month', (mrnDate.month() + 1).toString());
  await page.fill('mrnDate.year', mrnDate.year().toString());
  await page.click(commonContent.continue);
  page.seeInCurrentUrl(paths.compliance.checkMRNDate);
}

function goToCorrectPageAfterCheckMRN(commonContent, value, url) {
  

  await page.locator(`#checkedMRN-${value}`).check()
  await page.click(commonContent.continue);
  page.seeInCurrentUrl(url);
}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };

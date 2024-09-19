/* eslint-disable no-useless-escape */
const paths = require('../../../../paths');

async function goToCheckMrnPage(page, commonContent, mrnDate) {
  await page.fill('#mrnDate.day', mrnDate.date().toString());
  await page.fill('mrnDate.month', (mrnDate.month() + 1).toString());
  await page.fill('mrnDate.year', mrnDate.year().toString());
  await page.getByText(commonContent.continue).first().click();
  await page.waitForURL(`**\/${paths.compliance.checkMRNDate}`);
}

async function goToCorrectPageAfterCheckMRN(page, commonContent, value, url) {
  await page.locator(`#checkedMRN-${value}`).first().check();
  await page.getByText(commonContent.continue).first().click();
  await page.waitForURL(`**\/${url}`);
}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };

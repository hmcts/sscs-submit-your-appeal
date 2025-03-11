const paths = require('paths');

async function goToCheckMrnPage(I, commonContent, mrnDate) {
  await I.locator('#mrnDate.day').fill(mrnDate.date().toString());
  await I.locator('#mrnDate.month').fill((mrnDate.month() + 1).toString());
  await I.locator('#mrnDate.year').fill(mrnDate.year().toString());
  await I.getByRole('button', { name: commonContent.continue }).first().click();
  await I.waitForURL(`**/${paths.compliance.checkMRNDate}`);
}

async function goToCorrectPageAfterCheckMRN(I, commonContent, value, url) {
  await I.locator(`#checkedMRN${value === 'yes' ? '' : '-2'}`).check();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
  await I.waitForURL(`**/${url}`);
}

module.exports = { goToCorrectPageAfterCheckMRN, goToCheckMrnPage };

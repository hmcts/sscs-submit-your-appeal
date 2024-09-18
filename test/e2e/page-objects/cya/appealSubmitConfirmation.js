const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

function appealSubmitConfirmation(language) {
  
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await page.waitForTimeout(5);
  page.seeCurrentUrlEquals(paths.confirmation);
  expect(page.getByText(cyaContent.confirmation)).toBeVisible();
}

module.exports = { appealSubmitConfirmation };

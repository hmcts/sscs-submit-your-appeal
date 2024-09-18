const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

function checkYourAppealToConfirmation(page, language, signer) {
  
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await page.waitForTimeout(1);
  page.seeCurrentUrlEquals(paths.checkYourAppeal);
  await page.fill({ xpath: '//*[@id="signer"]' }, signer);
  await page.click(cyaContent.submitButton.value);
}

module.exports = { checkYourAppealToConfirmation };

/* eslint-disable no-useless-escape */
const checkYourAppealContentEn = require('../../../../steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('../../../../steps/check-your-appeal/content.cy');
const paths = require('../../../../paths');

async function checkYourAppealToConfirmation(page, language, signer) {
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await page.waitForTimeout(1000);
  await page.waitForURL(`**\/${paths.checkYourAppeal}`);
  await page.fill({ xpath: '//*[@id="signer"]' }, signer);
  await page.getByText(cyaContent.submitButton.value).first().click();
}

module.exports = { checkYourAppealToConfirmation };

const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

async function checkYourAppealToConfirmation(I, language, signer) {
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  await I.waitForURL(paths.checkYourAppeal);
  await I.locator('//*[@id="signer"]').first().fill(signer);
  await I.getByRole('button', { name: cyaContent.submitButton.value })
    .first()
    .click();
}

module.exports = { checkYourAppealToConfirmation };

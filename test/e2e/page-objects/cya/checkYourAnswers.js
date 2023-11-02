const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

function checkYourAppealToConfirmation(language, signer) {
  const I = this;
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  I.wait(1);
  I.seeCurrentUrlEquals(paths.checkYourAppeal);
  I.fillField({ id: 'signer' }, signer);
  I.click(cyaContent.submitButton.value);
}

module.exports = { checkYourAppealToConfirmation };

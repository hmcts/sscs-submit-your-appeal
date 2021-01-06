const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

function appealSubmitConfirmation(language) {
  const I = this;
  const cyaContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;
  I.wait(5);
  I.seeCurrentUrlEquals(paths.confirmation);
  I.see(cyaContent.confirmation);
}

module.exports = { appealSubmitConfirmation };

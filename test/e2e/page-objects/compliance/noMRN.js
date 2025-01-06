const noMRNContentEn = require('steps/compliance/no-mrn/content.en');
const noMRNContentCy = require('steps/compliance/no-mrn/content.cy');


function enterReasonForNoMRNAndContinue(language, commonContent, reason) {
  const I = this;
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  I.waitForText(noMRNContent.title);
  I.fillField('#reasonForNoMRN', reason);
  I.click(commonContent.continue);
}

function enterReasonForNoMRNAndContinueAfterSignIn(language, commonContent, reason) {
  const I = this;
  const noMRNContent = language === 'en' ? noMRNContentEn : noMRNContentCy;

  I.waitForText(noMRNContent.title);
  I.fillField('#reasonForNoMRN', reason);
  I.click(commonContent.saveAndContinue);
}

module.exports = { enterReasonForNoMRNAndContinue, enterReasonForNoMRNAndContinueAfterSignIn };

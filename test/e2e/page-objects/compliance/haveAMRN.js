const haveMRNContentEn = require('steps/compliance/have-a-mrn/content.en');
const haveMRNContentCy = require('steps/compliance/have-a-mrn/content.cy');

function selectHaveYouGotAMRNAndContinue(language, commonContent, option) {
  const I = this;
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  I.waitForText(haveMRNContent.title);
  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectHaveYouGotAMRNAndContinueAfterSignIn(language, commonContent, option) {
  const I = this;
  const haveMRNContent = language === 'en' ? haveMRNContentEn : haveMRNContentCy;

  I.waitForText(haveMRNContent.title);
  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouGotAMRNAndContinue, selectHaveYouGotAMRNAndContinueAfterSignIn };

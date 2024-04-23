const dwpContactContentEn = require('steps/compliance/have-contacted-dwp/content.en');
const dwpContactContentCy = require('steps/compliance/have-contacted-dwp/content.cy');


function selectHaveYouContactedDWPAndContinue(language, commonContent, option) {
  const I = this;
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  I.waitForText(dwpContactContent.title);
  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectHaveYouContactedDWPAndContinueAfterSignIn(language, commonContent, option) {
  const I = this;
  const dwpContactContent = language === 'en' ? dwpContactContentEn : dwpContactContentCy;

  I.waitForText(dwpContactContent.title);
  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectHaveYouContactedDWPAndContinue, selectHaveYouContactedDWPAndContinueAfterSignIn };

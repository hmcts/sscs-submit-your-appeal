const postCodeContentEn = require('steps/start/postcode-checker/content.en');
const postCodeContentCy = require('steps/start/postcode-checker/content.cy');


function enterPostcodeAndContinue(language, commonContent, postcode) {
  const I = this;
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  I.waitForText(postCodeContent.title);
  I.fillField({ id: 'postcode' }, postcode);
  I.click(commonContent.continue);
  I.wait(1);
}

function enterPostcodeAndContinueAfterSignIn(language, commonContent, postcode) {
  const I = this;
  const postCodeContent = language === 'en' ? postCodeContentEn : postCodeContentCy;

  I.waitForText(postCodeContent.title);
  I.fillField({ id: 'postcode' }, postcode);
  I.click(commonContent.saveAndContinue);
  I.wait(1);
}

module.exports = { enterPostcodeAndContinue, enterPostcodeAndContinueAfterSignIn };

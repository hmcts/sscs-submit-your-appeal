const hearingSupportContentEn = require('steps/hearing/support/content.en');
const hearingSupportContentCy = require('steps/hearing/support/content.cy');

function selectDoYouNeedSupportAndContinue(language, commonContent, option) {
  const I = this;
  const hearingSupportContent = language === 'en' ? hearingSupportContentEn : hearingSupportContentCy;

  I.waitForText(hearingSupportContent.title);
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectDoYouNeedSupportAndContinue };

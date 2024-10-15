const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');

function selectAreYouAnAppointeeAndContinue(language, commonContent, option) {
  const I = this;
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  I.waitForText(appointeeContent.fields.isAppointee.yes.replace('{{appointedBy}}', 'DWP'));
  I.checkOption(option);
  I.click(commonContent.continue);
}

function selectAreYouAnAppointeeAndContinueAfterSignIn(language, commonContent, option) {
  const I = this;
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  I.waitForText(appointeeContent.fields.isAppointee.yes.replace('{{appointedBy}}', 'DWP'));
  I.checkOption(option);
  I.click(commonContent.saveAndContinue);
}

module.exports = { selectAreYouAnAppointeeAndContinue, selectAreYouAnAppointeeAndContinueAfterSignIn };

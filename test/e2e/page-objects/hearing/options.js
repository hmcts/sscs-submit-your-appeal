const telHearingContentEn = require('steps/hearing/options/content.en');
const telHearingContentCy = require('steps/hearing/options/content.cy');

function selectTelephoneHearingOptionsAndContinue(language, commonContent) {
  const I = this;
  const telHearingContent = language === 'en' ? telHearingContentEn : telHearingContentCy;

  I.waitForText(telHearingContent.title);
  // I.waitForElement('#selectOptions', 5);
  I.checkOption('//input[@id=\'selectOptions.telephone.requested-true\']');
  I.fillField('//input[@id=\'selectOptions.telephone.phoneNumber\']', '07534345634');
  I.click(commonContent.continue);
}

module.exports = { selectTelephoneHearingOptionsAndContinue };

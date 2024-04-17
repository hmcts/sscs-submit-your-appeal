const benefitContentEn = require('steps/start/benefit-type/content.en');
const benefitContentCy = require('steps/start/benefit-type/content.cy');


function enterBenefitTypeAndContinue(language, commonContent, type) {
  const I = this;
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  I.waitForText(benefitContent.title);
  I.fillField({ id: 'benefitType' }, type);
  I.click('#benefitType__option--0');
  I.click(commonContent.continue);
}

function enterBenefitTypeAfterSignIn(language, commonContent, type) {
  const I = this;
  const benefitContent = language === 'en' ? benefitContentEn : benefitContentCy;

  I.waitForText(benefitContent.title);
  I.fillField({ id: 'benefitType' }, type);
  I.click('#benefitType__option--0');
  I.click(commonContent.saveAndContinue);
}

module.exports = { enterBenefitTypeAndContinue, enterBenefitTypeAfterSignIn };

const content = require('commonContent');
const benefitTypeContentEn = require('steps/start/benefit-type/content.en');
const benefitTypeContentCy = require('steps/start/benefit-type/content.cy');
const appealFormDownloadContentEn = require('steps/appeal-form-download/content.en');
const appealFormDownloadContentCy = require('steps/appeal-form-download/content.cy');
const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (appealFormDownloadContent, formType, benefitType) =>
  appealFormDownloadContent.subtitle
    .replace('{{ formDownload.type }}', formType)
    .replace('{{ benefitType }}', benefitType);

const languages = ['en', 'cy'];

Feature('Appeal form download page @batch-06');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];
  const benefitTypeContent = language === 'en' ? benefitTypeContentEn : benefitTypeContentCy;
  const appealFormDownloadContent = language === 'en' ? appealFormDownloadContentEn : appealFormDownloadContentCy;

  Scenario(`${language.toUpperCase()} - I see SSCS1 content when not selecting Carer's Allowance or CBLP`, I => {
    I.enterBenefitTypeAndContinue(commonContent, benefitTypes.disabilityLivingAllowance);
    // I.chooseLanguagePreference(commonContent, 'no');
    I.see(dynamicContent(appealFormDownloadContent, 'SSCS1', benefitTypeContent.benefitTypes.dla));
  });

  Scenario(`${language.toUpperCase()} - I see SSCS5 content when I select CBLP as a benefit type`, I => {
    I.enterBenefitTypeAndContinue(commonContent, benefitTypes.childBenefit);
    // I.chooseLanguagePreference(commonContent, 'no');
    I.see(dynamicContent(appealFormDownloadContent, 'SSCS5', benefitTypeContent.benefitTypes.cb));
  });

  Scenario(`${language.toUpperCase()} - I have a csrf token`, I => {
    I.seeElementInDOM('form input[name="_csrf"]');
  });
});

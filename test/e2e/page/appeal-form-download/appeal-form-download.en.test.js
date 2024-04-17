const language = 'en';
const commonContent = require('commonContent')[language];
const benefitTypeContent = require(`steps/start/benefit-type/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (appealContent, formType, benefitType) =>
  appealContent.subtitle
    .replace('{{ formDownload.type }}', formType)
    .replace('{{ benefitType }}', benefitType);

Feature(`${language.toUpperCase()} - Appeal form download page @batch-06`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I see SSCS1 content when not selecting Carer's Allowance or CBLP`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypes.disabilityLivingAllowance);
  // I.chooseLanguagePreference(commonContent, 'no');
  I.see(dynamicContent(appealFormDownloadContent, 'SSCS1', benefitTypeContent.benefitTypes.dla));
});

Scenario(`${language.toUpperCase()} - I see SSCS5 content when I select CBLP as a benefit type`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypes.childBenefit);
  // I.chooseLanguagePreference(commonContent, 'no');
  I.see(dynamicContent(appealFormDownloadContent, 'SSCS5', benefitTypeContent.benefitTypes.cb));
});

Scenario(`${language.toUpperCase()} - I see SSCS2 content when I select Child support as a benefit type`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, benefitTypes.childSupport);
  I.see(dynamicContent(appealFormDownloadContent, 'SSCS2', benefitTypeContent.benefitTypes.childSupport));
});

Scenario(`${language.toUpperCase()} - I have a csrf token`, ({ I }) => {
  I.seeElementInDOM('form input[name="_csrf"]');
});

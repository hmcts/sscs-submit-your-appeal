const language = 'en';
const commonContent = require('commonContent')[language];
const benefitTypeContent = require(`steps/start/benefit-type/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (appealContent, formType, benefitType) =>
  appealContent.subtitle.replace('{{ formDownload.type }}', formType).replace('{{ benefitType }}', benefitType);

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Appeal form download page @batch-06`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I see SSCS1 content when not selecting Carer's Allowance or CBLP`, ({ page }) => {
    enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.disabilityLivingAllowance);
    expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS1', benefitTypeContent.benefitTypes.dla))).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see SSCS5 content when I select CBLP as a benefit type`, ({ page }) => {
    enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.childBenefit);
    expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS5', benefitTypeContent.benefitTypes.cb))).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see SSCS2 content when I select Child support as a benefit type`, ({ page }) => {
    enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.childSupport);
    expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS2', benefitTypeContent.benefitTypes.childSupport))).toBeVisible();
  });

  test(`${language.toUpperCase()} - I have a csrf token`, ({ page }) => {
    page.seeElementInDOM('form input[name="_csrf"]');
  });
});

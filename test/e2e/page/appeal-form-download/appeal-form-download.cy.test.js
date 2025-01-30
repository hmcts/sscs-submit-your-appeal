const language = 'cy';
const commonContent = require('commonContent')[language];
const benefitTypeContent = require(`steps/start/benefit-type/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (appealContent, formType, benefitType) =>
  appealContent.subtitle
    .replace('{{ formDownload.type }}', formType)
    .replace('{{ benefitType }}', benefitType);

const { test, expect } = require('@playwright/test');
const { enterBenefitTypeAndContinue } = require('../../page-objects/start/benefit-type');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Appeal form download page`, { tag: '@batch-06' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - page see SSCS1 content when not selecting Carer's Allowance or CBLP`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.disabilityLivingAllowance);
    await expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS1', benefitTypeContent.benefitTypes.dla)).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page see SSCS5 content when page select CBLP as a benefit type`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.childBenefit);
    await expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS5', benefitTypeContent.benefitTypes.cb)).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page see SSCS2 content when page select Child support as a benefit type`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypes.childSupport);
    await expect(page.getByText(dynamicContent(appealFormDownloadContent, 'SSCS2', benefitTypeContent.benefitTypes.childSupport)).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page have a csrf token`, async({ page }) => {
    await expect(page.locator('form input[name="_csrf"]').first()).toBeVisible();
  });
});

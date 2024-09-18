const language = 'cy';
const commonContent = require('commonContent')[language];
const benefitTypeContent = require(
  `steps/start/benefit-type/content.${language}`
);
const appealFormDownloadContent = require(
  `steps/appeal-form-download/content.${language}`
);
const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (appealContent, formType, benefitType) =>
  appealContent.subtitle
    .replace('{{ formDownload.type }}', formType)
    .replace('{{ benefitType }}', benefitType);

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  enterBenefitTypeAndContinue
} = require('../../page-objects/start/benefit-type');

test.describe(`${language.toUpperCase()} - Appeal form download page @batch-06`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I see SSCS1 content when not selecting Carer's Allowance or CBLP`, async({
    page
  }) => {
    await enterBenefitTypeAndContinue(
      page,
      language,
      commonContent,
      benefitTypes.disabilityLivingAllowance
    );
    await expect(
      page.getByText(
        dynamicContent(
          appealFormDownloadContent,
          'SSCS1',
          benefitTypeContent.benefitTypes.dla
        )
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see SSCS5 content when I select CBLP as a benefit type`, async({
    page
  }) => {
    await enterBenefitTypeAndContinue(
      page,
      language,
      commonContent,
      benefitTypes.childBenefit
    );
    await expect(
      page.getByText(
        dynamicContent(
          appealFormDownloadContent,
          'SSCS5',
          benefitTypeContent.benefitTypes.cb
        )
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - I see SSCS2 content when I select Child support as a benefit type`, async({
    page
  }) => {
    await enterBenefitTypeAndContinue(
      page,
      language,
      commonContent,
      benefitTypes.childSupport
    );
    await expect(
      page.getByText(
        dynamicContent(
          appealFormDownloadContent,
          'SSCS2',
          benefitTypeContent.benefitTypes.childSupport
        )
      )
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - I have a csrf token`, async({ page }) => {
    await expect(
      page.locator('form input[name="_csrf"]').first()
    ).toBeVisible();
  });
});

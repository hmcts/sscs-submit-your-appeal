const language = 'en';
const commonContent = require('commonContent')[language];
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const benefitTypesObj = require('steps/start/benefit-type/types');
const paths = require('paths');

const benefitTypesArr = Object.keys(benefitTypesObj);
const sscs1 = [
  'attendanceAllowance',
  'bereavementBenefit',
  'carersAllowance',
  'disabilityLivingAllowance',
  'employmentAndSupportAllowance',
  'homeResponsibilitiesProtection',
  'incapacityBenefit',
  'incomeSupport',
  'industrialInjuriesDisablement',
  'jobseekersAllowance',
  'maternityAllowance',
  'personalIndependencePayment',
  'severeDisablementAllowance',
  'socialFund',
  'universalCredit',
  'bereavementSupportPaymentScheme',
  'healthPregnancy',
  'industrialDeathBenefit',
  'pensionCredit',
  'retirementPension',
  'disabilityWorkAllowance'
];
const sscs3 = ['compensationRecovery'];
const sscs5 = ['childBenefit', 'childCare', 'taxCredit', 'contractedOut', 'taxFreeChildcare', 'guardiansAllowance', 'guaranteedMinimumPension', 'nationalInsuranceCredits'];

const { test, expect } = require('@playwright/test');
const { enterBenefitTypeAndContinue } = require('../../page-objects/start/benefit-type');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Benefit Type`, { tag: '@batch-12' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page enter PIP, page am taken to the postcode-check page`, async({ page }) => {
    await enterBenefitTypeAndContinue(page, language, commonContent, 'pip');
    await page.waitForURL(`**${paths.start.postcodeCheck}`);
  });

  /* eslint-disable init-declarations */
  /* eslint-disable no-negated-condition */
  benefitTypesArr.forEach(benefitTypeKey => {
    if (benefitTypeKey !== 'personalIndependencePayment') {
      test(`${language.toUpperCase()} - When page enter ${benefitTypesObj[benefitTypeKey]} page go to download page`, async({ page }) => {
        let benefitForm;
        if (sscs1.indexOf(benefitTypeKey) !== -1) {
          benefitForm = 'SSCS1';
        } else if (sscs3.indexOf(benefitTypeKey) !== -1) {
          benefitForm = 'SSCS3';
        } else if (sscs5.indexOf(benefitTypeKey) !== -1) {
          benefitForm = 'SSCS5';
        } else {
          throw new Error('page do not know which form this is supposed to go to');
        }
        await enterBenefitTypeAndContinue(page, language, commonContent, benefitTypesObj[benefitTypeKey]);
        await page.waitForURL(`**${paths.appealFormDownload}`);
        await expect(page.getByText(appealFormDownloadContent.title).first()).toBeVisible();
        await expect(page.getByText(appealFormDownloadContent.button.text).first()).toBeVisible();
        await expect(page.getByText(benefitForm).first()).toBeVisible();
      });
    }
  });
/* eslint-enable init-declarations */
/* eslint-enable no-negated-condition */
});

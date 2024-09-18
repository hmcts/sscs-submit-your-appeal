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
const sscs5 = [
  'childBenefit',
  'childCare',
  'taxCredit',
  'contractedOut',
  'taxFreeChildcare',
  'guardiansAllowance',
  'guaranteedMinimumPension',
  'nationalInsuranceCredits'
];

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Benefit Type @batch-12`, () => {
  Before(async({ page }) => {
    await createTheSession(page, language);
  });

  After(async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I enter PIP, I am taken to the postcode-check page`, ({ page }) => {
    enterBenefitTypeAndContinue(page, language, commonContent, 'pip');
    page.seeInCurrentUrl(paths.start.postcodeCheck);
  });
});

/* eslint-disable init-declarations */
/* eslint-disable no-negated-condition */
benefitTypesArr.forEach(benefitTypeKey => {
  if (benefitTypeKey !== 'personalIndependencePayment') {
    test(`${language.toUpperCase()} - When I enter ${benefitTypesObj[benefitTypeKey]} I go to download page`, ({ page }) => {
      let benefitForm;
      if (sscs1.indexOf(benefitTypeKey) !== -1) {
        benefitForm = 'SSCS1';
      } else if (sscs3.indexOf(benefitTypeKey) !== -1) {
        benefitForm = 'SSCS3';
      } else if (sscs5.indexOf(benefitTypeKey) !== -1) {
        benefitForm = 'SSCS5';
      } else {
        throw new Error('I do not know which form this is supposed to go to');
      }
      enterBenefitTypeAndContinue(page, language, commonContent, benefitTypesObj[benefitTypeKey]);
      page.seeInCurrentUrl(paths.appealFormDownload);
      expect(page.getByText(appealFormDownloadContent.title)).toBeVisible();
      expect(page.getByText(appealFormDownloadContent.button.text)).toBeVisible();
      expect(page.getByText(benefitForm)).toBeVisible();
    });
  }
});
/* eslint-enable init-declarations */
/* eslint-enable no-negated-condition */

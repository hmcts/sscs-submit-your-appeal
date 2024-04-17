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

Feature(`${language.toUpperCase()} - Benefit Type @batch-12`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I enter PIP, I am taken to the postcode-check page`, ({ I }) => {
  I.enterBenefitTypeAndContinue(language, commonContent, 'pip');
  // I.chooseLanguagePreference(commonContent, 'no');
  I.seeInCurrentUrl(paths.start.postcodeCheck);
}).retry(2);

/* eslint-disable init-declarations */
/* eslint-disable no-negated-condition */
benefitTypesArr.forEach(benefitTypeKey => {
  if (benefitTypeKey !== 'personalIndependencePayment') {
    Scenario(`${language.toUpperCase()} - When I enter ${benefitTypesObj[benefitTypeKey]} I go to download page`, ({ I }) => {
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
      I.enterBenefitTypeAndContinue(language, commonContent, benefitTypesObj[benefitTypeKey]);
      // I.chooseLanguagePreference(commonContent, 'no');
      I.seeInCurrentUrl(paths.appealFormDownload);
      I.see(appealFormDownloadContent.title);
      I.see(appealFormDownloadContent.button.text);
      I.see(benefitForm);
    }).retry(2);
  }
});
/* eslint-enable init-declarations */
/* eslint-enable no-negated-condition */

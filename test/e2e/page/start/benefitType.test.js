const content = require('steps/appeal-form-download/content.en');
const benefitTypesObj = require('steps/start/benefit-type/types');
const paths = require('paths');

const benefitTypesArr = Object.keys(benefitTypesObj);

Feature('Benefit Type @batch-12');

Before(I => {
  I.createTheSession();
});

After(I => {
  I.endTheSession();
});

Scenario('When I enter PIP, I am taken to the postcode-check page', I => {
  I.enterBenefitTypeAndContinue('pip');
  // I.chooseLanguagePreference('no');
  I.seeInCurrentUrl(paths.start.postcodeCheck);
}).retry(2);


const sscs1 = [
  'attendanceAllowance',
  'bereavementBenefit',
  'carersAllowance',
  'disabilityLivingAllowance',
  'employmentAndSupportAllowance',
  'homeResponsibilitiesProtection',
  'housingBenefit',
  'incapacityBenefit',
  'incomeSupport',
  'industrialInjuriesDisablement',
  'jobseekersAllowance',
  'maternityAllowance',
  'personalIndependencePayment',
  'severeDisablementAllowance',
  'socialFund',
  'universalCredit',
  'bereavementSupport',
  'healthPregnancy',
  'industrialDeath',
  'pensionCredits',
  'retirementPension',
  'disabilityWorkAllowance'
];
const sscs3 = ['compensationRecovery'];
const sscs5 = ['childBenefit', 'childCare', 'taxCredits', 'contractedOut', 'taxFreeChildcare'];
/* eslint-disable init-declarations */
/* eslint-disable no-negated-condition */
benefitTypesArr.forEach(benefitTypeKey => {
  if (benefitTypeKey !== 'personalIndependencePayment') {
    Scenario(`When I enter ${benefitTypesObj[benefitTypeKey]} I go to download page`, I => {
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
      I.enterBenefitTypeAndContinue(benefitTypesObj[benefitTypeKey]);
      // I.chooseLanguagePreference('no');
      I.seeInCurrentUrl(paths.appealFormDownload);
      I.see(content.title);
      I.see(content.button.text);
      I.see(benefitForm);
    }).retry(2);
  }
});
/* eslint-enable init-declarations */
/* eslint-enable no-negated-condition */

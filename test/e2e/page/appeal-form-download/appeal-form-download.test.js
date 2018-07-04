const benefitTypes = require('steps/start/benefit-type/types');

const dynamicContent = (formType, benefitType) =>
  `Download and fill out a ${formType} form to appeal a ${benefitType} benefit decision.`;

Feature('Appeal form download page @batch-06');

Before(I => {
  I.createTheSession();
});

After(I => {
  I.endTheSession();
});

Scenario('I see SSCS1 content when not selecting Carer’s Allowance or Child Benefit', I => {
  I.enterBenefitTypeAndContinue(benefitTypes.disabilityLivingAllowance);
  I.see(dynamicContent('SSCS1', 'Disability Living Allowance (DLA)'));
});

Scenario('I see SSCS5 content when I select Child Benefit as a benefit type', I => {
  I.enterBenefitTypeAndContinue(benefitTypes.childBenefit);
  I.see(dynamicContent('SSCS5', 'Child Benefit'));
});

const benefitTypes = require('steps/start/benefit-type/types');

Feature('Appointee form download page');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('I see SSCS1 content when I select any Benefit type other than Carer’s Allowance or Child Benefit', (I) => {

    I.enterBenefitTypeAndContinue(benefitTypes.disabilityLivingAllowance);
    I.see('Download and fill out a SSCS1 form to appeal a Disability Living Allowance (DLA) benefit decision.');

});

Scenario('I see SSCS5 content when I select Child Benefit as a benefit type', (I) => {

    I.enterBenefitTypeAndContinue(benefitTypes.childBenefit);
    I.see('Download and fill out a SSCS5 form to appeal a Child Benefit benefit decision.');

});

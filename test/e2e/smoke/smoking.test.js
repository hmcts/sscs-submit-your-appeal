const benefitTypes = require('steps/start/benefit-type/types');

Feature('Smoking HOT!');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('Smoke test demo @smoke', (I) => {

    I.enterBenefitTypeAndContinue(benefitTypes.disabilityLivingAllowance);
    I.see('Download and fill out a SSCS1 form to appeal a Disability Living Allowance (DLA) benefit decision.');

});

const content = require('steps/identity/appointee-form-download/content.en.json');
const paths = require('paths');

Feature('Appointee form download page');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('I see SSCS1 content when I select any Benefit type other than Carer’s Allowance or Child Benefit', (I) => {

    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.see('Download and fill out a SSCS1 form to appeal a Disability Living Allowance (DLA) benefit decision.');

});

Scenario.only('I see SSCS5 content when I select Carer’s Allowance as a benefit type', (I) => {

    I.enterBenefitTypeAndContinue('Carer’s Allowance');
    I.see('Download and fill out a SSCS5 form to appeal a Carer’s Allowance benefit decision.');

});

Scenario('I see SSCS5 content when I select Child Benefit as a benefit type', (I) => {

    I.enterBenefitTypeAndContinue('Child Benefit');
    I.see('Download and fill out a SSCS5 form to appeal a Child Benefit benefit decision.');

});

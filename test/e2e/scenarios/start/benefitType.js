'use strict';

const paths = require('paths');

Feature('Benefit Type');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});


Scenario('When I enter PIP, I am taken to the postcode-check page', (I) => {

    I.enterBenefitTypeAndContinue('Personal Independence Payment (PIP)');
    I.seeInCurrentUrl(paths.start.postcodeCheck);

});

Scenario('When I enter a non PIP benefit type, I am taken to the download form page', (I) => {

    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);

});

const benefit = new DataTable(['BenefitType', 'BenefitName']); //
benefit.add(['Attendance Allowance', 'Attendance Allowance']); // adding records to a table
benefit.add(['Bereavement Benefit', 'Bereavement Benefit']);
benefit.add(['Carer’s Allowance', 'Carer’s Allowance']);
benefit.add(['Disability Living Allowance (DLA)', 'Disability Living Allowance (DLA)']);
benefit.add(['Employment and Support Allowance (ESA)', 'Employment and Support Allowance (ESA)']);
benefit.add(['Incapacity Benefit', 'Incapacity Benefit']);
benefit.add(['Industrial Injuries Disablement', 'Industrial Injuries Disablement']);
benefit.add(['Jobseeker’s Allowance (JSA)', 'Jobseeker’s Allowance (JSA)']);
benefit.add(['Maternity Allowance', 'Maternity Allowance']);
benefit.add(['Severe Disablement Allowance', 'Severe Disablement Allowance']);
benefit.add(['Social Fund', 'Social Fund']);
benefit.add(['Universal Credit (UC)', 'Universal Credit (UC)']);

Data(benefit).Scenario('When I enter differernt non PIP benefit types, I am taken to the download form page', (I, current) => {
    I.enterBenefitTypeAndContinue(current.BenefitName);
    I.see(current.BenefitName, {css: '.column-two-thirds>p'});
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
    I.see('Continue to form download');
    I.click({css: '.link-back'});
});

Scenario('Check the Benefit form, I am taken to the download form page', (I) => {
    I.enterBenefitTypeAndContinue('Disability Living Allowance (DLA)');
    I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
    I.click({css: '.button'}); //Continue to form download
    I.seeInCurrentUrl("https://hmctsformfinder.justice.gov.uk/HMCTS/GetForm.do?original_id=3038");
});

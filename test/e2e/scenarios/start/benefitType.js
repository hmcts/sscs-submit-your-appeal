'use strict';

const content = require('steps/identity/appointee-form-download/content.en');
const benefitTypesObj = require('steps/start/benefit-type/types');
const benefitTypesArr = Object.values(benefitTypesObj);
const paths = require('paths');

Feature('Benefit Type');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('When I enter PIP, I am taken to the postcode-check page', (I) => {

    I.enterBenefitTypeAndContinue('pip');
    I.seeInCurrentUrl(paths.start.postcodeCheck);

});

benefitTypesArr.forEach((benefitType) => {

    if (benefitType !== benefitTypesObj.personalIndependencePayment) {

        Scenario(`When I enter ${benefitType} I am taken to the download form page`, (I) => {

            I.enterBenefitTypeAndContinue(benefitType);
            I.seeInCurrentUrl(paths.identity.downloadAppointeeForm);
            I.see(content.title);
            I.see(content.button.text);

        });
    }
});
